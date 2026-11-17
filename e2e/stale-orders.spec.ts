import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

import { E2E_CRON_SECRET } from "../playwright.config";

const CRON_PATH = "/api/cron/release-stale-orders";
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const prisma = new PrismaClient();

let variantId = "";
let seededStock = 0;
const orderIds: string[] = [];
const addressIds: string[] = [];

/** An unpaid card order for one unit of the test variant, created `ageMs` ago. */
async function createUnpaidCardOrder(ageMs: number): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "demo@lunaria.beauty" },
  });
  const variant = await prisma.productVariant.findUniqueOrThrow({
    where: { id: variantId },
  });
  const order = await prisma.order.create({
    data: {
      user: { connect: { id: user.id } },
      status: "PENDING",
      paymentMethod: "CARD",
      paymentStatus: "UNPAID",
      subtotal: variant.price,
      shippingCost: 0,
      discount: 0,
      total: variant.price,
      createdAt: new Date(Date.now() - ageMs),
      address: {
        create: {
          user: { connect: { id: user.id } },
          fullName: "E2E Stale Order",
          phone: "0900000000",
          street: "1 Test St",
          district: "Quận 1",
          city: "TP.HCM",
        },
      },
      items: {
        create: [
          { variantId: variant.id, quantity: 1, unitPrice: variant.price },
        ],
      },
    },
    select: { id: true, addressId: true },
  });
  orderIds.push(order.id);
  addressIds.push(order.addressId);
  return order.id;
}

test.beforeAll(async () => {
  const variant = await prisma.productVariant.findFirstOrThrow({
    where: { stock: { gt: 0 } },
  });
  variantId = variant.id;
  seededStock = variant.stock;
  // Checkout reserves the unit when the order is placed; mirror that here.
  await prisma.productVariant.update({
    where: { id: variantId },
    data: { stock: seededStock - 1 },
  });
});

test.afterAll(async () => {
  await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
  await prisma.address.deleteMany({ where: { id: { in: addressIds } } });
  await prisma.productVariant.update({
    where: { id: variantId },
    data: { stock: seededStock },
  });
  await prisma.$disconnect();
});

test("the cron route rejects calls without the cron secret", async ({
  request,
}) => {
  const missing = await request.get(CRON_PATH);
  expect(missing.status()).toBe(401);

  const wrong = await request.get(CRON_PATH, {
    headers: { authorization: "Bearer wrong-value" },
  });
  expect(wrong.status()).toBe(401);
});

test("the cron job cancels a stale unpaid card order and returns its stock", async ({
  request,
}) => {
  const staleId = await createUnpaidCardOrder(TWO_HOURS_MS);
  const freshId = await createUnpaidCardOrder(0);

  const res = await request.get(CRON_PATH, {
    headers: { authorization: `Bearer ${E2E_CRON_SECRET}` },
  });
  expect(res.status()).toBe(200);
  expect((await res.json()).released).toBeGreaterThanOrEqual(1);

  const stale = await prisma.order.findUniqueOrThrow({
    where: { id: staleId },
  });
  expect(stale.status).toBe("CANCELLED");

  const fresh = await prisma.order.findUniqueOrThrow({
    where: { id: freshId },
  });
  expect(fresh.status).toBe("PENDING");

  const variant = await prisma.productVariant.findUniqueOrThrow({
    where: { id: variantId },
  });
  expect(variant.stock).toBe(seededStock);
});

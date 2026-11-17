import { test, expect, type Page } from "@playwright/test";
import { PrismaClient, type PaymentMethod } from "@prisma/client";
import Stripe from "stripe";

/**
 * Cancelling an order must give back what placing it took: item stock and
 * the coupon use. Covers the admin cancel flow and Stripe's
 * payment_intent.canceled webhook, including repeats (no double restock).
 */

// Must match playwright.config.ts webServer env (E2E_WEBHOOK_SECRET).
const WEBHOOK_SECRET = "whsec_e2e_test";
const QTY = 2;

const prisma = new PrismaClient();
const stripe = new Stripe("sk_test_e2e_signing_only");
const created: { orderIds: string[]; couponIds: string[] } = {
  orderIds: [],
  couponIds: [],
};

/** Simulates a placed order: takes stock and one coupon use, like placeOrder. */
async function placeHeldOrder(paymentMethod: PaymentMethod) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "demo@lunaria.beauty" },
  });
  const variant = await prisma.productVariant.findFirstOrThrow({
    where: { stock: { gte: QTY } },
  });
  const coupon = await prisma.coupon.create({
    data: {
      code: `E2E-INV-${Date.now()}-${created.couponIds.length}`,
      type: "FIXED",
      value: 1_000,
      usedCount: 1,
    },
  });
  created.couponIds.push(coupon.id);
  await prisma.productVariant.update({
    where: { id: variant.id },
    data: { stock: { decrement: QTY } },
  });
  const subtotal = variant.price * QTY;
  const order = await prisma.order.create({
    data: {
      user: { connect: { id: user.id } },
      status: "PENDING",
      paymentMethod,
      paymentStatus: "UNPAID",
      subtotal,
      shippingCost: 0,
      discount: 1_000,
      couponCode: coupon.code,
      total: subtotal - 1_000,
      address: {
        create: {
          user: { connect: { id: user.id } },
          fullName: "E2E Inventory",
          phone: "0900000000",
          street: "1 Test St",
          district: "Quận 1",
          city: "TP.HCM",
        },
      },
      items: {
        create: [
          { variantId: variant.id, quantity: QTY, unitPrice: variant.price },
        ],
      },
    },
  });
  created.orderIds.push(order.id);
  return {
    orderId: order.id,
    variantId: variant.id,
    couponId: coupon.id,
    stockAfterOrder: variant.stock - QTY,
  };
}

const stockOf = async (variantId: string) =>
  (await prisma.productVariant.findUniqueOrThrow({ where: { id: variantId } }))
    .stock;
const usesOf = async (couponId: string) =>
  (await prisma.coupon.findUniqueOrThrow({ where: { id: couponId } }))
    .usedCount;
const statusOf = async (orderId: string) =>
  (await prisma.order.findUniqueOrThrow({ where: { id: orderId } })).status;

async function sendCanceledEvent(page: Page, orderId: string) {
  const payload = JSON.stringify({
    id: `evt_e2e_cancel_${orderId}`,
    object: "event",
    type: "payment_intent.canceled",
    data: {
      object: { id: "pi_e2e", object: "payment_intent", metadata: { orderId } },
    },
  });
  const header = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: WEBHOOK_SECRET,
  });
  const res = await page.request.post("/api/webhooks/stripe", {
    headers: { "stripe-signature": header, "content-type": "application/json" },
    data: payload,
  });
  expect(res.status()).toBe(200);
}

async function setStatusAsAdmin(page: Page, orderId: string, status: string) {
  await page.goto(`/admin/orders/${orderId}`);
  await page.locator('select[name="status"]').selectOption(status);
  await page.getByRole("button", { name: "Cập nhật" }).click();
  await expect.poll(() => statusOf(orderId)).toBe(status);
}

test.afterAll(async () => {
  const orders = await prisma.order.findMany({
    where: { id: { in: created.orderIds } },
    select: { addressId: true },
  });
  await prisma.order.deleteMany({ where: { id: { in: created.orderIds } } });
  await prisma.address.deleteMany({
    where: { id: { in: orders.map((o) => o.addressId) } },
  });
  await prisma.coupon.deleteMany({ where: { id: { in: created.couponIds } } });
  await prisma.$disconnect();
});

test("Stripe payment_intent.canceled cancels the order and restocks once", async ({
  page,
}) => {
  const o = await placeHeldOrder("CARD");

  await sendCanceledEvent(page, o.orderId);
  expect(await statusOf(o.orderId)).toBe("CANCELLED");
  expect(await stockOf(o.variantId)).toBe(o.stockAfterOrder + QTY);
  expect(await usesOf(o.couponId)).toBe(0);

  // Stripe redelivers events: a replay must not add stock again.
  await sendCanceledEvent(page, o.orderId);
  expect(await stockOf(o.variantId)).toBe(o.stockAfterOrder + QTY);
});

test("admin cancel restocks; later refund does not restock twice", async ({
  page,
}) => {
  const o = await placeHeldOrder("COD");

  await page.goto("/auth/login");
  await page.fill("#login-email", "admin@lunaria.beauty");
  await page.fill("#login-password", "admin123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });

  await setStatusAsAdmin(page, o.orderId, "CANCELLED");
  expect(await stockOf(o.variantId)).toBe(o.stockAfterOrder + QTY);
  expect(await usesOf(o.couponId)).toBe(0);

  await setStatusAsAdmin(page, o.orderId, "REFUNDED");
  expect(await stockOf(o.variantId)).toBe(o.stockAfterOrder + QTY);
});

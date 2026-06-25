import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// Must match playwright.config.ts webServer env (E2E_WEBHOOK_SECRET).
const WEBHOOK_SECRET = "whsec_e2e_test";

const prisma = new PrismaClient();
// Any key works for local signing — generateTestHeaderString/constructEvent
// use the webhook secret, not this API key.
const stripe = new Stripe("sk_test_e2e_signing_only");

let orderId = "";
let addressId = "";

test.beforeAll(async () => {
  const user = await prisma.user.findUnique({
    where: { email: "demo@lunaria.beauty" },
  });
  const variant = await prisma.productVariant.findFirst();
  if (!user || !variant)
    throw new Error("E2E seed data missing (user/variant)");

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
      paymentIntent: `pi_e2e_${Date.now()}`,
      address: {
        create: {
          user: { connect: { id: user.id } },
          fullName: "E2E Webhook",
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
  orderId = order.id;
  addressId = order.addressId;
});

test.afterAll(async () => {
  if (orderId) await prisma.order.deleteMany({ where: { id: orderId } });
  if (addressId) await prisma.address.deleteMany({ where: { id: addressId } });
  await prisma.$disconnect();
});

test("webhook marks the order paid on a signed payment_intent.succeeded", async ({
  request,
}) => {
  const payload = JSON.stringify({
    id: "evt_e2e",
    object: "event",
    type: "payment_intent.succeeded",
    data: {
      object: {
        id: "pi_e2e_object",
        object: "payment_intent",
        metadata: { orderId },
      },
    },
  });
  const header = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: WEBHOOK_SECRET,
  });

  const res = await request.post("/api/webhooks/stripe", {
    headers: { "stripe-signature": header, "content-type": "application/json" },
    data: payload,
  });
  expect(res.status()).toBe(200);

  const updated = await prisma.order.findUnique({ where: { id: orderId } });
  expect(updated?.paymentStatus).toBe("PAID");
  expect(updated?.status).toBe("CONFIRMED");
});

test("webhook rejects an invalid signature with 400", async ({ request }) => {
  const res = await request.post("/api/webhooks/stripe", {
    headers: {
      "stripe-signature": "t=1,v1=deadbeef",
      "content-type": "application/json",
    },
    data: JSON.stringify({
      type: "payment_intent.succeeded",
      data: { object: {} },
    }),
  });
  expect(res.status()).toBe(400);
});

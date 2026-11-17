import { revalidatePath } from "next/cache";
import type Stripe from "stripe";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/modules/orders/emails";
import { releaseOrder } from "@/modules/orders/inventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook endpoint. Verifies the signature against the raw request body,
 * then marks the matching order paid on `payment_intent.succeeded`. The update
 * is idempotent — it only transitions orders still in the UNPAID state, so a
 * redelivered event is a no-op and never re-sends the confirmation email.
 *
 * `payment_intent.canceled` cancels a still-unpaid order and returns its stock
 * and coupon use. `payment_intent.payment_failed` is deliberately ignored: the
 * customer can retry the same PaymentIntent with another card.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !sig) {
    return new Response("Webhook not configured", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const orderId = pi.metadata?.orderId;

    if (orderId) {
      const updated = await prisma.order.updateMany({
        where: { id: orderId, paymentStatus: "UNPAID" },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });

      if (updated.count > 0) {
        try {
          await sendOrderConfirmationEmail(orderId);
        } catch {
          // Email delivery is best-effort: a failure here must not cause the
          // webhook to error and trigger a Stripe redelivery.
        }

        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);
      }
    }
  }

  if (event.type === "payment_intent.canceled") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const orderId = pi.metadata?.orderId;

    if (orderId) {
      const released = await prisma.$transaction((tx) =>
        releaseOrder(tx, orderId, "CANCELLED", {
          paymentMethod: "CARD",
          paymentStatus: "UNPAID",
        }),
      );
      if (released) {
        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);
      }
    }
  }

  return new Response(null, { status: 200 });
}

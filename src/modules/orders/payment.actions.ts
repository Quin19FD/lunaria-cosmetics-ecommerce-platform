"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isStripeConfigured, STRIPE_CURRENCY, stripe } from "@/lib/stripe";

export type CreatePaymentIntentResult =
  | { ok: true; clientSecret: string }
  | { ok: false; error: string };

/**
 * Creates (or reuses) a Stripe PaymentIntent for a CARD order and returns its
 * client secret so the browser can confirm payment with Stripe Elements. The
 * order is only marked paid by the Stripe webhook once payment succeeds, never
 * here. Amounts are integer VND (zero-decimal), sent to Stripe verbatim.
 */
export async function createPaymentIntent(
  orderId: string,
): Promise<CreatePaymentIntentResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Phiên đăng nhập đã hết hạn." };

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    select: {
      id: true,
      total: true,
      paymentMethod: true,
      paymentStatus: true,
      paymentIntent: true,
    },
  });
  if (!order) return { ok: false, error: "Không tìm thấy đơn hàng." };
  if (order.paymentStatus === "PAID") {
    return { ok: false, error: "Đơn hàng đã được thanh toán." };
  }
  if (order.paymentMethod !== "CARD") {
    return { ok: false, error: "Đơn hàng này không thanh toán bằng thẻ." };
  }

  if (!isStripeConfigured) {
    return { ok: false, error: "Thanh toán thẻ chưa được cấu hình." };
  }

  try {
    // Idempotency: reuse an existing PaymentIntent unless it has reached a
    // terminal state, in which case a fresh one is created below.
    if (order.paymentIntent) {
      const existing = await stripe.paymentIntents.retrieve(
        order.paymentIntent,
      );
      if (existing.status !== "succeeded" && existing.status !== "canceled") {
        return { ok: true, clientSecret: existing.client_secret! };
      }
    }

    const pi = await stripe.paymentIntents.create({
      amount: order.total,
      currency: STRIPE_CURRENCY,
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntent: pi.id },
    });

    return { ok: true, clientSecret: pi.client_secret! };
  } catch {
    return { ok: false, error: "Không thể khởi tạo thanh toán." };
  }
}

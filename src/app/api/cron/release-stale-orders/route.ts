import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { isStripeConfigured, stripe } from "@/lib/stripe";
import { releaseStaleCardOrders } from "@/modules/orders/stale";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

async function cancelPaymentIntent(paymentIntentId: string): Promise<boolean> {
  // Without Stripe keys no intent can be paid, so there is nothing to cancel.
  if (!isStripeConfigured) return true;
  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
    return true;
  } catch {
    // Already succeeded, processing, or already cancelled: leave the order to
    // the webhook, which is the source of truth for payment state.
    return false;
  }
}

/**
 * Scheduled job (Vercel Cron sends `Authorization: Bearer $CRON_SECRET`).
 * Releases stock held by card orders that were never paid.
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await releaseStaleCardOrders({
    db: prisma,
    cancelPaymentIntent,
  });
  return NextResponse.json(result);
}

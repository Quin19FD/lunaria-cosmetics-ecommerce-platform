import type { PrismaClient } from "@prisma/client";

import { releaseOrder } from "./inventory";

/** An unpaid card order holds its stock for this long before it is released. */
export const STALE_CARD_ORDER_MS = 60 * 60 * 1000;

const BATCH_SIZE = 100;

export interface StaleReleaseResult {
  /** Orders cancelled and restocked by this run. */
  released: number;
  /** Orders left alone: Stripe refused the cancel (e.g. paid meanwhile). */
  skipped: number;
}

export interface StaleReleaseDeps {
  db: Pick<PrismaClient, "order" | "$transaction">;
  /**
   * Cancels the Stripe PaymentIntent so the customer cannot pay for stock that
   * was given back. Resolves false when it could not be cancelled.
   */
  cancelPaymentIntent: (paymentIntentId: string) => Promise<boolean>;
  now?: Date;
  maxAgeMs?: number;
}

/**
 * Cancels card orders that were never paid and returns their stock and coupon
 * use. An order whose PaymentIntent cannot be cancelled is skipped: it was
 * most likely paid in the meantime and the webhook will mark it PAID.
 */
export async function releaseStaleCardOrders({
  db,
  cancelPaymentIntent,
  now = new Date(),
  maxAgeMs = STALE_CARD_ORDER_MS,
}: StaleReleaseDeps): Promise<StaleReleaseResult> {
  const unpaidCard = {
    paymentMethod: "CARD",
    paymentStatus: "UNPAID",
  } as const;
  const stale = await db.order.findMany({
    where: {
      ...unpaidCard,
      status: "PENDING",
      createdAt: { lt: new Date(now.getTime() - maxAgeMs) },
    },
    select: { id: true, paymentIntent: true },
    orderBy: { createdAt: "asc" },
    take: BATCH_SIZE,
  });

  let released = 0;
  let skipped = 0;
  for (const order of stale) {
    if (
      order.paymentIntent &&
      !(await cancelPaymentIntent(order.paymentIntent))
    ) {
      skipped += 1;
      continue;
    }
    const done = await db.$transaction((tx) =>
      releaseOrder(tx, order.id, "CANCELLED", unpaidCard),
    );
    if (done) released += 1;
    else skipped += 1;
  }
  return { released, skipped };
}

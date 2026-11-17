import { describe, expect, it, vi } from "vitest";

import { STALE_CARD_ORDER_MS, releaseStaleCardOrders } from "../stale";

type Deps = Parameters<typeof releaseStaleCardOrders>[0];

const NOW = new Date("2026-11-17T12:00:00Z");

/** Database double: `claimCount` is what the release claim reports per order. */
function fakeDb(
  stale: { id: string; paymentIntent: string | null }[],
  claimCount = 1,
) {
  const tx = {
    order: {
      updateMany: vi.fn().mockResolvedValue({ count: claimCount }),
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        couponCode: null,
        items: [{ variantId: "v1", quantity: 2 }],
      }),
    },
    productVariant: { update: vi.fn().mockResolvedValue({}) },
    coupon: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
  };
  const db = {
    order: { findMany: vi.fn().mockResolvedValue(stale) },
    $transaction: vi.fn((run: (t: typeof tx) => Promise<boolean>) => run(tx)),
  };
  return { db, tx, asDb: db as unknown as Deps["db"] };
}

describe("releaseStaleCardOrders", () => {
  it("only looks at unpaid, pending card orders older than the cutoff", async () => {
    const { db, asDb } = fakeDb([]);

    await releaseStaleCardOrders({
      db: asDb,
      cancelPaymentIntent: vi.fn(),
      now: NOW,
    });

    expect(db.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          paymentMethod: "CARD",
          paymentStatus: "UNPAID",
          status: "PENDING",
          createdAt: { lt: new Date(NOW.getTime() - STALE_CARD_ORDER_MS) },
        },
      }),
    );
  });

  it("cancels the PaymentIntent, then cancels the order and restocks it", async () => {
    const { tx, asDb } = fakeDb([{ id: "o1", paymentIntent: "pi_1" }]);
    const cancelPaymentIntent = vi.fn().mockResolvedValue(true);

    const result = await releaseStaleCardOrders({
      db: asDb,
      cancelPaymentIntent,
      now: NOW,
    });

    expect(result).toEqual({ released: 1, skipped: 0 });
    expect(cancelPaymentIntent).toHaveBeenCalledWith("pi_1");
    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: {
        paymentMethod: "CARD",
        paymentStatus: "UNPAID",
        id: "o1",
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      data: { status: "CANCELLED" },
    });
    expect(tx.productVariant.update).toHaveBeenCalledWith({
      where: { id: "v1" },
      data: { stock: { increment: 2 } },
    });
  });

  it("leaves the order alone when Stripe refuses the cancel (paid meanwhile)", async () => {
    const { db, asDb } = fakeDb([{ id: "o1", paymentIntent: "pi_1" }]);

    const result = await releaseStaleCardOrders({
      db: asDb,
      cancelPaymentIntent: vi.fn().mockResolvedValue(false),
      now: NOW,
    });

    expect(result).toEqual({ released: 0, skipped: 1 });
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("releases an order that never got a PaymentIntent without calling Stripe", async () => {
    const { asDb } = fakeDb([{ id: "o1", paymentIntent: null }]);
    const cancelPaymentIntent = vi.fn();

    const result = await releaseStaleCardOrders({
      db: asDb,
      cancelPaymentIntent,
      now: NOW,
    });

    expect(result).toEqual({ released: 1, skipped: 0 });
    expect(cancelPaymentIntent).not.toHaveBeenCalled();
  });

  it("does not count an order another run already released", async () => {
    const { tx, asDb } = fakeDb([{ id: "o1", paymentIntent: null }], 0);

    const result = await releaseStaleCardOrders({
      db: asDb,
      cancelPaymentIntent: vi.fn(),
      now: NOW,
    });

    expect(result).toEqual({ released: 0, skipped: 1 });
    expect(tx.productVariant.update).not.toHaveBeenCalled();
  });
});

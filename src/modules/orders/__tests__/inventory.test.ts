import { describe, expect, it, vi } from "vitest";

import {
  OutOfStockError,
  isReleasedStatus,
  releaseOrder,
  reserveStock,
} from "../inventory";

type Tx = Parameters<typeof releaseOrder>[0];

/** Minimal transaction double recording the calls releaseOrder makes. */
function fakeTx(opts: {
  claimCount: number;
  stockUpdateCount?: number;
  couponCode?: string | null;
}) {
  const tx = {
    order: {
      updateMany: vi.fn().mockResolvedValue({ count: opts.claimCount }),
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        couponCode: opts.couponCode ?? null,
        items: [
          { variantId: "v1", quantity: 2 },
          { variantId: "v2", quantity: 1 },
        ],
      }),
    },
    productVariant: {
      update: vi.fn().mockResolvedValue({}),
      updateMany: vi
        .fn()
        .mockResolvedValue({ count: opts.stockUpdateCount ?? 1 }),
    },
    coupon: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
  };
  return { tx, asTx: tx as unknown as Tx };
}

describe("isReleasedStatus", () => {
  it("is true only for CANCELLED and REFUNDED", () => {
    expect(isReleasedStatus("CANCELLED")).toBe(true);
    expect(isReleasedStatus("REFUNDED")).toBe(true);
    expect(isReleasedStatus("PENDING")).toBe(false);
    expect(isReleasedStatus("DELIVERED")).toBe(false);
  });
});

describe("releaseOrder", () => {
  it("returns every item to stock and frees the coupon use", async () => {
    const { tx, asTx } = fakeTx({ claimCount: 1, couponCode: "SALE10" });

    await expect(releaseOrder(asTx, "o1", "CANCELLED")).resolves.toBe(true);

    expect(tx.productVariant.update).toHaveBeenCalledWith({
      where: { id: "v1" },
      data: { stock: { increment: 2 } },
    });
    expect(tx.productVariant.update).toHaveBeenCalledWith({
      where: { id: "v2" },
      data: { stock: { increment: 1 } },
    });
    expect(tx.coupon.updateMany).toHaveBeenCalledWith({
      where: { code: "SALE10", usedCount: { gt: 0 } },
      data: { usedCount: { decrement: 1 } },
    });
  });

  it("claims the transition only from a non-released status", async () => {
    const { tx, asTx } = fakeTx({ claimCount: 1 });
    await releaseOrder(asTx, "o1", "REFUNDED", { paymentStatus: "UNPAID" });

    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: {
        paymentStatus: "UNPAID",
        id: "o1",
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      data: { status: "REFUNDED" },
    });
  });

  it("does nothing when the order was already released (no double restock)", async () => {
    const { tx, asTx } = fakeTx({ claimCount: 0, couponCode: "SALE10" });

    await expect(releaseOrder(asTx, "o1", "CANCELLED")).resolves.toBe(false);

    expect(tx.productVariant.update).not.toHaveBeenCalled();
    expect(tx.coupon.updateMany).not.toHaveBeenCalled();
  });

  it("skips the coupon when the order used none", async () => {
    const { tx, asTx } = fakeTx({ claimCount: 1, couponCode: null });
    await releaseOrder(asTx, "o1", "CANCELLED");
    expect(tx.coupon.updateMany).not.toHaveBeenCalled();
  });
});

describe("reserveStock", () => {
  it("decrements only where enough stock remains", async () => {
    const { tx, asTx } = fakeTx({ claimCount: 1, stockUpdateCount: 1 });
    await reserveStock(asTx, "v1", 3);
    expect(tx.productVariant.updateMany).toHaveBeenCalledWith({
      where: { id: "v1", stock: { gte: 3 } },
      data: { stock: { decrement: 3 } },
    });
  });

  it("throws OutOfStockError when the conditional update matches nothing", async () => {
    const { asTx } = fakeTx({ claimCount: 1, stockUpdateCount: 0 });
    await expect(reserveStock(asTx, "v1", 3)).rejects.toBeInstanceOf(
      OutOfStockError,
    );
  });
});

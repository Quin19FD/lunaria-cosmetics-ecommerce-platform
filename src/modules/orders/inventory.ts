import type { OrderStatus, Prisma } from "@prisma/client";

/** Statuses where the order no longer holds stock or a coupon use. */
export const RELEASED_STATUSES = [
  "CANCELLED",
  "REFUNDED",
] as const satisfies readonly OrderStatus[];

export type ReleasedStatus = (typeof RELEASED_STATUSES)[number];

export function isReleasedStatus(
  status: OrderStatus,
): status is ReleasedStatus {
  return (RELEASED_STATUSES as readonly OrderStatus[]).includes(status);
}

type Tx = Pick<Prisma.TransactionClient, "order" | "productVariant" | "coupon">;

export class OutOfStockError extends Error {
  constructor(public readonly variantId: string) {
    super("Một sản phẩm trong giỏ không đủ hàng.");
    this.name = "OutOfStockError";
  }
}

/**
 * Takes `quantity` units of a variant, only if that many are in stock.
 * The check and the decrement are one conditional UPDATE, so two concurrent
 * orders cannot both take the last unit.
 */
export async function reserveStock(
  tx: Tx,
  variantId: string,
  quantity: number,
): Promise<void> {
  const { count } = await tx.productVariant.updateMany({
    where: { id: variantId, stock: { gte: quantity } },
    data: { stock: { decrement: quantity } },
  });
  if (count !== 1) throw new OutOfStockError(variantId);
}

/**
 * Moves an order to CANCELLED/REFUNDED and gives back what it held: item
 * stock and the coupon use. The status change is claimed with a conditional
 * update, so concurrent or repeated calls release at most once.
 *
 * `where` narrows the claim further (e.g. only still-unpaid orders).
 * Returns false when nothing was released (already released or not matched).
 */
export async function releaseOrder(
  tx: Tx,
  orderId: string,
  status: ReleasedStatus,
  where: Prisma.OrderWhereInput = {},
): Promise<boolean> {
  const claimed = await tx.order.updateMany({
    where: { ...where, id: orderId, status: { notIn: [...RELEASED_STATUSES] } },
    data: { status },
  });
  if (claimed.count === 0) return false;

  const order = await tx.order.findUniqueOrThrow({
    where: { id: orderId },
    select: {
      couponCode: true,
      items: { select: { variantId: true, quantity: true } },
    },
  });
  for (const item of order.items) {
    await tx.productVariant.update({
      where: { id: item.variantId },
      data: { stock: { increment: item.quantity } },
    });
  }
  if (order.couponCode) {
    await tx.coupon.updateMany({
      where: { code: order.couponCode, usedCount: { gt: 0 } },
      data: { usedCount: { decrement: 1 } },
    });
  }
  return true;
}

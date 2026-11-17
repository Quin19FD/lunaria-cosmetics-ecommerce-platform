/**
 * Order money rules shared by the server (placeOrder) and the cart/checkout
 * UI, so the totals a customer sees match what is charged. All amounts are
 * integer VND.
 */

export const FREE_SHIPPING_THRESHOLD = 500_000;
export const SHIPPING_FEE = 30_000;

/** Flat shipping fee, waived once the subtotal reaches the threshold. */
export function shippingFeeFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export interface OrderAmounts {
  subtotal: number;
  shippingCost: number;
  discount: number;
}

/** Grand total; never negative even if a discount exceeds the order. */
export function orderTotal({
  subtotal,
  shippingCost,
  discount,
}: OrderAmounts): number {
  return Math.max(0, subtotal + shippingCost - discount);
}

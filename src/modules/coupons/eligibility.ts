export interface CouponRules {
  active: boolean;
  expiresAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
  minOrder: number;
}

export type CouponIneligibility =
  | "inactive"
  | "expired"
  | "used_up"
  | "below_min_order";

/**
 * Checks whether a coupon may be applied to an order subtotal at `now`.
 * Returns the first failing rule, or null when the coupon is usable.
 * Used by both the checkout preview and placeOrder so they cannot disagree.
 */
export function couponIneligibility(
  coupon: CouponRules,
  subtotal: number,
  now: Date,
): CouponIneligibility | null {
  if (!coupon.active) return "inactive";
  if (coupon.expiresAt && coupon.expiresAt < now) return "expired";
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return "used_up";
  }
  if (subtotal < coupon.minOrder) return "below_min_order";
  return null;
}

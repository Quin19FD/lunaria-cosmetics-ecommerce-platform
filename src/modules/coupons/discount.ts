export interface CouponLike {
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscount: number | null;
}

/** Discount amount in VND, capped so it never exceeds the subtotal. */
export function computeDiscount(coupon: CouponLike, subtotal: number): number {
  let discount: number;
  if (coupon.type === "PERCENT") {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount != null) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.value;
  }
  return Math.min(discount, subtotal);
}

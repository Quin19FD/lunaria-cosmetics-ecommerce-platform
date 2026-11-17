"use server";

import { prisma } from "@/lib/db";
import {
  RATE_LIMITS,
  consumeRateLimit,
  rateLimitMessage,
  requestIp,
} from "@/lib/rate-limit";

import { computeDiscount } from "./discount";
import { type CouponIneligibility, couponIneligibility } from "./eligibility";

export interface CouponResult {
  ok: true;
  code: string;
  discount: number;
  description: string;
}
export type ValidateCouponResult = CouponResult | { ok: false; error: string };

/**
 * Validates a coupon against an order subtotal and returns the discount.
 * Pure read — does NOT consume the coupon (placeOrder does that atomically).
 */
export async function validateCoupon(
  rawCode: string,
  subtotal: number,
): Promise<ValidateCouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Vui lòng nhập mã giảm giá." };

  // Slows down coupon-code enumeration.
  const limit = await consumeRateLimit([
    [RATE_LIMITS.coupon, await requestIp()],
  ]);
  if (!limit.ok)
    return { ok: false, error: rateLimitMessage(limit.retryAfterSec) };

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) return { ok: false, error: "Mã giảm giá không hợp lệ." };
  const problem = couponIneligibility(coupon, subtotal, new Date());
  if (problem) return { ok: false, error: couponErrorMessage(problem, coupon) };

  const discount = computeDiscount(coupon, subtotal);
  const description =
    coupon.type === "PERCENT"
      ? `Giảm ${coupon.value}%`
      : `Giảm ${coupon.value.toLocaleString("vi-VN")}₫`;

  return { ok: true, code, discount, description };
}

function couponErrorMessage(
  problem: CouponIneligibility,
  coupon: { minOrder: number },
): string {
  switch (problem) {
    case "inactive":
      return "Mã giảm giá không hợp lệ.";
    case "expired":
      return "Mã giảm giá đã hết hạn.";
    case "used_up":
      return "Mã giảm giá đã hết lượt sử dụng.";
    case "below_min_order":
      return `Đơn tối thiểu ${coupon.minOrder.toLocaleString("vi-VN")}₫ để dùng mã này.`;
  }
}

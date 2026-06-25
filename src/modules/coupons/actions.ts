"use server";

import { prisma } from "@/lib/db";

import { computeDiscount } from "./discount";

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

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) {
    return { ok: false, error: "Mã giảm giá không hợp lệ." };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { ok: false, error: "Mã giảm giá đã hết hạn." };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: "Mã giảm giá đã hết lượt sử dụng." };
  }
  if (subtotal < coupon.minOrder) {
    return {
      ok: false,
      error: `Đơn tối thiểu ${coupon.minOrder.toLocaleString("vi-VN")}₫ để dùng mã này.`,
    };
  }

  const discount = computeDiscount(coupon, subtotal);
  const description =
    coupon.type === "PERCENT"
      ? `Giảm ${coupon.value}%`
      : `Giảm ${coupon.value.toLocaleString("vi-VN")}₫`;

  return { ok: true, code, discount, description };
}

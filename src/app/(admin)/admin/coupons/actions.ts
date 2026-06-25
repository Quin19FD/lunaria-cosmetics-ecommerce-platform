"use server";

import type { DiscountType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

function parseForm(formData: FormData) {
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  const type: DiscountType =
    formData.get("type") === "FIXED" ? "FIXED" : "PERCENT";

  const value = Math.trunc(Number(formData.get("value")));

  const minOrderRaw = Number(formData.get("minOrder"));
  const minOrder =
    Number.isFinite(minOrderRaw) && minOrderRaw > 0
      ? Math.trunc(minOrderRaw)
      : 0;

  const maxDiscountRaw = String(formData.get("maxDiscount") ?? "").trim();
  const maxDiscount =
    maxDiscountRaw && Number.isFinite(Number(maxDiscountRaw))
      ? Math.trunc(Number(maxDiscountRaw))
      : null;

  const expiresRaw = String(formData.get("expiresAt") ?? "").trim();
  const expiresAt = expiresRaw ? new Date(expiresRaw) : null;

  const usageRaw = String(formData.get("usageLimit") ?? "").trim();
  const usageLimit =
    usageRaw && Number.isFinite(Number(usageRaw))
      ? Math.trunc(Number(usageRaw))
      : null;

  const active = formData.get("active") === "on";

  return {
    code,
    type,
    value,
    minOrder,
    maxDiscount,
    expiresAt,
    usageLimit,
    active,
  };
}

export async function createCoupon(formData: FormData) {
  const data = parseForm(formData);
  if (!data.code || !data.value || data.value <= 0) return;

  try {
    await prisma.coupon.create({ data });
  } catch {
    // Duplicate code (unique constraint) — ignore for MVP.
    return;
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(id: string, formData: FormData) {
  const data = parseForm(formData);
  if (!data.code || !data.value || data.value <= 0) return;

  try {
    // Never reset usedCount — it is left out of the update payload.
    await prisma.coupon.update({ where: { id }, data });
  } catch {
    // Duplicate code (unique constraint) — ignore for MVP.
    return;
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({ where: { id } });
  } catch {
    // Already gone — just refresh without crashing.
  }
  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(id: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
    select: { active: true },
  });
  if (!coupon) return;

  await prisma.coupon.update({
    where: { id },
    data: { active: !coupon.active },
  });

  revalidatePath("/admin/coupons");
}

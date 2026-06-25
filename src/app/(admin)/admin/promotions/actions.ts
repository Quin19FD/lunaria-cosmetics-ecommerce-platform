"use server";

import type { PromoColor } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

const PROMO_COLORS: PromoColor[] = ["pink", "purple", "amber", "emerald"];

function parseForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  const discount = String(formData.get("discount") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const endDate = String(formData.get("endDate") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  const colorRaw = String(formData.get("color") ?? "");
  const color: PromoColor = PROMO_COLORS.includes(colorRaw as PromoColor)
    ? (colorRaw as PromoColor)
    : "pink";

  const productSlugs = String(formData.get("productSlugs") ?? "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const active = formData.get("active") === "on";

  return {
    title,
    subtitle,
    code,
    discount,
    description,
    endDate,
    image,
    color,
    productSlugs,
    active,
  };
}

export async function createPromotion(formData: FormData) {
  const data = parseForm(formData);
  if (!data.title || !data.code) return;

  try {
    await prisma.promotion.create({ data });
  } catch {
    // Duplicate code (unique constraint) — ignore for MVP.
    return;
  }

  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
  redirect("/admin/promotions");
}

export async function updatePromotion(id: string, formData: FormData) {
  const data = parseForm(formData);
  if (!data.title || !data.code) return;

  try {
    await prisma.promotion.update({ where: { id }, data });
  } catch {
    // Duplicate code (unique constraint) — ignore for MVP.
    return;
  }

  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
  redirect("/admin/promotions");
}

export async function deletePromotion(id: string) {
  try {
    await prisma.promotion.delete({ where: { id } });
  } catch {
    // Already gone — just refresh without crashing.
  }
  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
}

export async function togglePromotion(id: string) {
  const promotion = await prisma.promotion.findUnique({
    where: { id },
    select: { active: true },
  });
  if (!promotion) return;

  await prisma.promotion.update({
    where: { id },
    data: { active: !promotion.active },
  });

  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
}

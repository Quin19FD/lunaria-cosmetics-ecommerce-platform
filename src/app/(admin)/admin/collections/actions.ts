"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

import { prisma } from "@/lib/db";

function parseForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || name, { lower: true, strict: true });

  const badge = String(formData.get("badge") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const highlightWord = String(formData.get("highlightWord") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const ctaLabel = String(formData.get("ctaLabel") ?? "").trim();
  const heroImage = String(formData.get("heroImage") ?? "").trim();
  const cardImage = String(formData.get("cardImage") ?? "").trim();

  const description = String(formData.get("description") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const productSlugs = String(formData.get("productSlugs") ?? "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    name,
    slug,
    badge,
    label,
    headline,
    highlightWord,
    summary,
    description,
    ctaLabel,
    heroImage,
    cardImage,
    productSlugs,
  };
}

export async function createCollection(formData: FormData) {
  const data = parseForm(formData);
  if (!data.name || !data.slug) return;

  try {
    await prisma.collection.create({ data });
  } catch {
    // Duplicate slug (unique constraint) — ignore for MVP.
    return;
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  redirect("/admin/collections");
}

export async function updateCollection(id: string, formData: FormData) {
  const data = parseForm(formData);
  if (!data.name || !data.slug) return;

  try {
    await prisma.collection.update({ where: { id }, data });
  } catch {
    // Duplicate slug (unique constraint) — ignore for MVP.
    return;
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  redirect("/admin/collections");
}

export async function deleteCollection(id: string) {
  try {
    await prisma.collection.delete({ where: { id } });
  } catch {
    // Already gone — just refresh without crashing.
  }
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
}

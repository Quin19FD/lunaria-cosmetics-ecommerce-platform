"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

import { prisma } from "@/lib/db";

function parseForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  const slug = rawSlug
    ? slugify(rawSlug, { lower: true, strict: true })
    : slugify(name, { lower: true, strict: true });

  return {
    name,
    slug,
    description: description || null,
    country: country || null,
  };
}

export async function createBrand(formData: FormData) {
  const { name, slug, description, country } = parseForm(formData);
  if (!name || !slug) return;

  await prisma.brand.create({
    data: { name, slug, description, country },
  });

  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function updateBrand(id: string, formData: FormData) {
  const { name, slug, description, country } = parseForm(formData);
  if (!name || !slug) return;

  await prisma.brand.update({
    where: { id },
    data: { name, slug, description, country },
  });

  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({ where: { id } });
  } catch {
    // Likely an FK constraint (products still reference this brand).
    // Acceptable for MVP — just refresh without crashing.
  }
  revalidatePath("/admin/brands");
}

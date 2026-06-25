"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

import { prisma } from "@/lib/db";

function parseForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const parentIdRaw = String(formData.get("parentId") ?? "").trim();

  const slug = rawSlug
    ? slugify(rawSlug, { lower: true, strict: true })
    : slugify(name, { lower: true, strict: true });

  return {
    name,
    slug,
    description: description || null,
    parentId: parentIdRaw || null,
  };
}

export async function createCategory(formData: FormData) {
  const { name, slug, description, parentId } = parseForm(formData);
  if (!name || !slug) return;

  await prisma.category.create({
    data: { name, slug, description, parentId },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const { name, slug, description, parentId } = parseForm(formData);
  if (!name || !slug) return;

  await prisma.category.update({
    where: { id },
    // A category cannot be its own parent.
    data: {
      name,
      slug,
      description,
      parentId: parentId === id ? null : parentId,
    },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    // Likely an FK constraint (products still reference this category).
    // Acceptable for MVP — just refresh without crashing.
  }
  revalidatePath("/admin/categories");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

import { prisma } from "@/lib/db";

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const howToUse = String(formData.get("howToUse") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const brandId = String(formData.get("brandId") ?? "").trim();
  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";

  if (!name) throw new Error("Tên sản phẩm là bắt buộc.");
  if (!categoryId) throw new Error("Danh mục là bắt buộc.");
  if (!brandId) throw new Error("Thương hiệu là bắt buộc.");

  return {
    name,
    slug: slugify(name, { lower: true, strict: true }),
    description: description || null,
    ingredients: ingredients || null,
    howToUse: howToUse || null,
    categoryId,
    brandId,
    isActive,
    isFeatured,
  };
}

export async function createProduct(formData: FormData) {
  const data = readProductFields(formData);
  await prisma.product.create({ data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const data = readProductFields(formData);
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

function readVariantFields(formData: FormData) {
  const sku = String(formData.get("sku") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const rawSale = String(formData.get("salePrice") ?? "").trim();
  const rawWeight = String(formData.get("weight") ?? "").trim();
  const stock = Number(formData.get("stock")) || 0;

  if (!sku) throw new Error("SKU là bắt buộc.");
  if (!name) throw new Error("Tên phiên bản là bắt buộc.");
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Giá không hợp lệ.");
  }

  return {
    sku,
    name,
    price: Math.round(price),
    salePrice: rawSale ? Math.round(Number(rawSale)) : null,
    stock: Math.max(0, Math.round(stock)),
    weight: rawWeight ? Math.round(Number(rawWeight)) : null,
  };
}

export async function createVariant(productId: string, formData: FormData) {
  const data = readVariantFields(formData);
  await prisma.productVariant.create({ data: { ...data, productId } });
  revalidatePath(`/admin/products/${productId}`);
}

export async function updateVariant(
  productId: string,
  variantId: string,
  formData: FormData,
) {
  const data = readVariantFields(formData);
  await prisma.productVariant.update({ where: { id: variantId }, data });
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteVariant(productId: string, variantId: string) {
  await prisma.productVariant.delete({ where: { id: variantId } });
  revalidatePath(`/admin/products/${productId}`);
}

export async function createImage(productId: string, formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();
  const position = Number(formData.get("position")) || 0;

  if (!url) throw new Error("URL ảnh là bắt buộc.");

  await prisma.productImage.create({
    data: { productId, url, alt: alt || null, position: Math.round(position) },
  });
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteImage(productId: string, imageId: string) {
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/products/${productId}`);
}

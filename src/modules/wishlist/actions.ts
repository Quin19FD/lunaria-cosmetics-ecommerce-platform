"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productService } from "@/modules/products";
import type { Product } from "@/modules/products";

export type ToggleWishlistResult =
  | { ok: true; added: boolean }
  | { ok: false; error: string };

/** Adds the product to the wishlist if absent, removes it if present. */
export async function toggleWishlist(
  productId: string,
): Promise<ToggleWishlistResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "Vui lòng đăng nhập." };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/account/wishlist");
    return { ok: true, added: false };
  }

  await prisma.wishlistItem.create({ data: { userId, productId } });
  revalidatePath("/account/wishlist");
  return { ok: true, added: true };
}

/** Product ids the current user has wishlisted (empty for guests). */
export async function getWishlistIds(): Promise<string[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  return items.map((i) => i.productId);
}

/** Full product views for the current user's wishlist. */
export async function listWishlist(): Promise<Product[]> {
  const ids = await getWishlistIds();
  return productService.getByIds(ids);
}

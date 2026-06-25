"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const PLACEHOLDER = "https://placehold.co/600x600/fce7f0/ef3985?text=Lunaria";

export interface CartLine {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  variantName: string;
  price: number;
  salePrice: number | null;
  stock: number;
}

/**
 * Resolves cart variant ids to fresh DB views for display. Drops variants
 * that no longer exist / whose product is inactive.
 */
export async function getCartItems(variantIds: string[]): Promise<CartLine[]> {
  if (variantIds.length === 0) return [];
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds }, product: { isActive: true } },
    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
      stock: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: {
            select: { url: true },
            orderBy: { position: "asc" },
            take: 1,
          },
        },
      },
    },
  });
  return variants.map((v) => ({
    variantId: v.id,
    productId: v.product.id,
    productName: v.product.name,
    productSlug: v.product.slug,
    image: v.product.images[0]?.url ?? PLACEHOLDER,
    variantName: v.name,
    price: v.price,
    salePrice: v.salePrice,
    stock: v.stock,
  }));
}

export interface ServerCartItem {
  variantId: string;
  quantity: number;
}

/** Reads the logged-in user's persisted cart (empty for guests). */
export async function getServerCart(): Promise<ServerCartItem[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { items: { select: { variantId: true, quantity: true } } },
  });
  return cart?.items ?? [];
}

/** Overwrites the logged-in user's persisted cart with the given items. */
export async function saveCart(items: ServerCartItem[]): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return;

  const clean = items.filter((i) => i.quantity > 0);

  await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select: { id: true },
    });
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    if (clean.length > 0) {
      await tx.cartItem.createMany({
        data: clean.map((i) => ({
          cartId: cart.id,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        skipDuplicates: true,
      });
    }
  });
}

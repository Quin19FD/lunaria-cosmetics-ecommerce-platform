import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

import type { Product, ProductFilters, SkinType } from "../types";

const PAGE_SIZE = 12;

const PRODUCT_INCLUDE = {
  category: { select: { name: true, slug: true } },
  brand: { select: { name: true } },
  variants: {
    select: { id: true, name: true, price: true, salePrice: true, stock: true },
  },
  images: { select: { url: true }, orderBy: { position: "asc" } },
  reviews: { where: { isVisible: true }, select: { rating: true } },
} satisfies Prisma.ProductInclude;

type ProductRecord = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_INCLUDE;
}>;

const PLACEHOLDER = "https://placehold.co/600x600/fce7f0/ef3985?text=Lunaria";

function pickDefaultVariant(
  variants: {
    id: string;
    price: number;
    salePrice: number | null;
    stock: number;
  }[],
): string | null {
  if (variants.length === 0) return null;
  const pool = variants.filter((v) => v.stock > 0);
  const candidates = pool.length ? pool : variants;
  const eff = (v: { price: number; salePrice: number | null }) =>
    v.salePrice ?? v.price;
  return candidates.reduce((min, v) => (eff(v) < eff(min) ? v : min)).id;
}

function toView(p: ProductRecord): Product {
  const prices = p.variants.map((v) => v.price);
  const price = prices.length ? Math.min(...prices) : 0;
  const sales = p.variants
    .map((v) => v.salePrice)
    .filter((n): n is number => n != null);
  const salePrice = sales.length ? Math.min(...sales) : undefined;

  const ratings = p.reviews.map((r) => r.rating);
  const rating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
      10
    : 0;

  const images = p.images.map((i) => i.url);

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    image: images[0] ?? PLACEHOLDER,
    images,
    category: p.category.name,
    categorySlug: p.category.slug,
    brand: p.brand.name,
    price,
    salePrice,
    rating,
    reviewCount: ratings.length,
    badge: (p.badge as Product["badge"]) ?? undefined,
    skinTypes: p.skinTypes as SkinType[],
    isActive: p.isActive,
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      salePrice: v.salePrice ?? undefined,
      stock: v.stock,
    })),
    defaultVariantId: pickDefaultVariant(p.variants),
  };
}

export interface ProductListResult {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toView);
  },

  async getFiltered(filters: ProductFilters = {}): Promise<ProductListResult> {
    const where: Prisma.ProductWhereInput = { isActive: true };
    if (filters.category) where.category = { slug: filters.category };
    if (filters.skinType) where.skinTypes = { has: filters.skinType };

    const rows = await prisma.product.findMany({
      where,
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    let products = rows.map(toView);

    if (filters.minPrice != null) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice != null) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    switch (filters.sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // already newest-first from query
        break;
      case "popular":
      default:
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    const total = products.length;
    const page = filters.page ?? 1;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const data = products.slice(start, start + PAGE_SIZE);
    return { data, total, page, totalPages, pageSize: PAGE_SIZE };
  },

  async getBestSellers(limit = 4): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    const views = rows.map(toView);
    views.sort((a, b) => b.rating - a.rating);
    return views.slice(0, limit);
  },

  async getFeatured(limit = 8): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(toView);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const row = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: PRODUCT_INCLUDE,
    });
    return row ? toView(row) : null;
  },

  async getByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const rows = await prisma.product.findMany({
      where: { id: { in: ids }, isActive: true },
      include: PRODUCT_INCLUDE,
    });
    return rows.map(toView);
  },

  async getById(id: string): Promise<Product | null> {
    const row = await prisma.product.findFirst({
      where: { id, isActive: true },
      include: PRODUCT_INCLUDE,
    });
    return row ? toView(row) : null;
  },

  async getByCategory(categorySlug: string): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: { isActive: true, category: { slug: categorySlug } },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toView);
  },

  async getProductsBySlugs(slugs: string[]): Promise<Product[]> {
    if (slugs.length === 0) return [];
    const rows = await prisma.product.findMany({
      where: { isActive: true, slug: { in: slugs } },
      include: PRODUCT_INCLUDE,
    });
    const views = rows.map(toView);
    // preserve the requested slug order
    return slugs
      .map((s) => views.find((v) => v.slug === s))
      .filter((v): v is Product => v != null);
  },

  async search(query: string): Promise<Product[]> {
    const q = query.trim();
    if (!q) return [];
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toView);
  },

  async getRelated(product: Product, limit = 4): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: product.categorySlug },
        id: { not: product.id },
      },
      include: PRODUCT_INCLUDE,
      take: limit,
    });
    return rows.map(toView);
  },
};

import { prisma } from "@/lib/db";

import type { Category } from "../types";

const PLACEHOLDER = "https://placehold.co/400x400/fce7f0/ef3985?text=Lunaria";

function toView(c: {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? PLACEHOLDER,
  };
}

export const catalogService = {
  async getAllCategories(): Promise<Category[]> {
    const rows = await prisma.category.findMany({
      where: { parentId: null },
      select: { id: true, name: true, slug: true, image: true },
      orderBy: { name: "asc" },
    });
    return rows.map(toView);
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const row = await prisma.category.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true, image: true },
    });
    return row ? toView(row) : null;
  },

  async getFeaturedCategories(limit = 5): Promise<Category[]> {
    const rows = await prisma.category.findMany({
      where: { parentId: null },
      select: { id: true, name: true, slug: true, image: true },
      orderBy: { name: "asc" },
      take: limit,
    });
    return rows.map(toView);
  },
};

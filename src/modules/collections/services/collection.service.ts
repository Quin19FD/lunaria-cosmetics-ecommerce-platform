import { prisma } from "@/lib/db";
import { productService } from "@/modules/products";
import type { Product } from "@/modules/products";

import type { Collection } from "../types";

const PAGE_SIZE = 8;

export const collectionService = {
  async getAll(): Promise<Collection[]> {
    return prisma.collection.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });
  },

  async getBySlug(slug: string): Promise<Collection | null> {
    return prisma.collection.findUnique({ where: { slug } });
  },

  async getProducts(
    collection: Collection,
    page = 1,
  ): Promise<{
    data: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const products = await productService.getProductsBySlugs(
      collection.productSlugs,
    );

    const total = products.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const data = products.slice(start, start + PAGE_SIZE);

    return { data, total, page, totalPages };
  },
};

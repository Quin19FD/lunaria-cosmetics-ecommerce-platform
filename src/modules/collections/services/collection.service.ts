import { productService } from "@/modules/products";
import type { Product } from "@/modules/products";

import { COLLECTIONS_MOCK } from "../data/collections.mock";
import type { Collection } from "../types";

const PAGE_SIZE = 8;

export const collectionService = {
  getAll(): Collection[] {
    return COLLECTIONS_MOCK;
  },

  getBySlug(slug: string): Collection | undefined {
    return COLLECTIONS_MOCK.find((c) => c.slug === slug);
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

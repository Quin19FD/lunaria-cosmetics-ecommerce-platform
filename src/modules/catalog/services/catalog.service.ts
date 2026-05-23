import { CATEGORIES_MOCK } from "../data/categories.mock";
import type { Category } from "../types";


export const catalogService = {
  getAllCategories(): Category[] {
    return CATEGORIES_MOCK;
  },

  getCategoryBySlug(slug: string): Category | undefined {
    return CATEGORIES_MOCK.find((c) => c.slug === slug);
  },

  getFeaturedCategories(limit = 5): Category[] {
    return CATEGORIES_MOCK.slice(0, limit);
  },
};

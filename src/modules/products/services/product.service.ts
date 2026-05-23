import { PRODUCTS_MOCK } from "../data/products.mock";
import type { Product, ProductFilters } from "../types";

const PAGE_SIZE = 12;

export const productService = {
  getAll(): Product[] {
    return PRODUCTS_MOCK.filter((p) => p.isActive);
  },

  getFiltered(filters: ProductFilters = {}) {
    let products = this.getAll();

    if (filters.category) {
      products = products.filter((p) => p.categorySlug === filters.category);
    }
    if (filters.skinType) {
      products = products.filter((p) => p.skinTypes.includes(filters.skinType!));
    }
    if (filters.minPrice != null) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice != null) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    // Sort
    switch (filters.sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        products.reverse();
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
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

  getBestSellers(limit = 4): Product[] {
    return this.getAll()
      .filter((p) => p.badge === "bestseller" || p.rating >= 4.7)
      .slice(0, limit);
  },

  getFeatured(limit = 8): Product[] {
    return this.getAll().slice(0, limit);
  },

  getBySlug(slug: string): Product | undefined {
    return this.getAll().find((p) => p.slug === slug);
  },

  getById(id: string): Product | undefined {
    return this.getAll().find((p) => p.id === id);
  },

  getByCategory(categorySlug: string): Product[] {
    return this.getAll().filter((p) => p.categorySlug === categorySlug);
  },

  getCategories(): string[] {
    const cats = new Set(this.getAll().map((p) => p.category));
    return Array.from(cats);
  },

  search(query: string): Product[] {
    const q = query.toLowerCase();
    return this.getAll().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  },

  getRelated(product: Product, limit = 4): Product[] {
    return this.getAll()
      .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
      .slice(0, limit);
  },
};

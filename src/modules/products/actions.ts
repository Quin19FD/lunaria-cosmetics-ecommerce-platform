"use server";

import { catalogService } from "@/modules/catalog";
import type { Category } from "@/modules/catalog";

import {
  productService,
  type ProductListResult,
} from "./services/product.service";
import type { ProductFilters } from "./types";

export async function getFilteredProducts(
  filters: ProductFilters,
): Promise<ProductListResult> {
  return productService.getFiltered(filters);
}

export async function getFilterCategories(): Promise<Category[]> {
  return catalogService.getAllCategories();
}

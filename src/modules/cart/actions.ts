"use server";

import { productService } from "@/modules/products";
import type { Product } from "@/modules/products";

/**
 * Resolves localStorage cart product ids to fresh DB product views.
 * Filters out ids that no longer exist / are inactive.
 */
export async function getCartProducts(ids: string[]): Promise<Product[]> {
  return productService.getByIds(ids);
}

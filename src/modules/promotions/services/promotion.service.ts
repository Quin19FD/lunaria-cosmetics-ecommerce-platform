import { productService } from "@/modules/products";
import type { Product } from "@/modules/products";

import { FLASH_DEALS_MOCK, PROMOTIONS_MOCK } from "../data/promotions.mock";
import type { FlashDeal, Promotion } from "../types";

export const promotionService = {
  getAll(): Promotion[] {
    return PROMOTIONS_MOCK;
  },

  getById(id: string): Promotion | undefined {
    return PROMOTIONS_MOCK.find((p) => p.id === id);
  },

  async getFlashDeals(): Promise<(FlashDeal & { product: Product })[]> {
    const products = await productService.getProductsBySlugs(
      FLASH_DEALS_MOCK.map((deal) => deal.productSlug),
    );
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return FLASH_DEALS_MOCK.map((deal) => {
      const product = bySlug.get(deal.productSlug);
      return product ? { ...deal, product } : null;
    }).filter((d): d is FlashDeal & { product: Product } => d != null);
  },

  getPromotionProducts(promo: Promotion): Promise<Product[]> {
    return productService.getProductsBySlugs(promo.productSlugs);
  },
};

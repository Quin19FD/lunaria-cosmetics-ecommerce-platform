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

  getFlashDeals(): (FlashDeal & { product: Product })[] {
    return FLASH_DEALS_MOCK.map((deal) => {
      const product = productService.getById(deal.productId);
      return product ? { ...deal, product } : null;
    }).filter((d): d is NonNullable<typeof d> => d != null);
  },

  getPromotionProducts(promo: Promotion): Product[] {
    return promo.productIds
      .map((id) => productService.getById(id))
      .filter((p): p is Product => p != null);
  },
};

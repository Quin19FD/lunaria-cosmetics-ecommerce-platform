import { ORDERS_MOCK } from "../data/orders.mock";
import type { Order } from "../types";

const PAGE_SIZE = 8;

export const accountService = {
  getOrders(page = 1): {
    data: Order[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const total = ORDERS_MOCK.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const data = ORDERS_MOCK.slice(start, start + PAGE_SIZE);
    return { data, total, page, totalPages };
  },

  getLoyaltyPoints(): { points: number; nextTier: string; remaining: number } {
    return { points: 2450, nextTier: "Kim Cương", remaining: 550 };
  },
};

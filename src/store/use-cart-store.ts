import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  variantId: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (variantId: string, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (variantId, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === variantId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { variantId, quantity }] };
        });
      },
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "lunaria-cart" },
  ),
);

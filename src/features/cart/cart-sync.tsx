"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { getServerCart, saveCart } from "@/modules/cart/actions";
import { useCartStore, type CartItem } from "@/store/use-cart-store";

function mergeCarts(local: CartItem[], server: CartItem[]): CartItem[] {
  const byVariant = new Map<string, number>();
  for (const item of [...server, ...local]) {
    byVariant.set(
      item.variantId,
      (byVariant.get(item.variantId) ?? 0) + item.quantity,
    );
  }
  return Array.from(byVariant, ([variantId, quantity]) => ({
    variantId,
    quantity,
  }));
}

/**
 * Bridges the client cart store with the per-user DB cart:
 * - on login: merges the guest cart with the user's saved cart (cross-device)
 * - while logged in: debounced-persists every cart change
 * - on logout: clears the local cart so it doesn't leak to the next visitor
 */
export function CartSync() {
  const { status } = useSession();
  const items = useCartStore((s) => s.items);
  const setItems = useCartStore((s) => s.setItems);
  const clearCart = useCartStore((s) => s.clearCart);

  const synced = useRef(false);
  const prevStatus = useRef(status);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Merge on login / clear on logout.
  useEffect(() => {
    if (status === "authenticated" && !synced.current) {
      synced.current = true;
      // Real login (was logged out) merges the guest cart into the saved one;
      // a fresh load that is already authenticated just adopts the server cart
      // (source of truth) to avoid double-counting on every refresh.
      const justLoggedIn = prevStatus.current === "unauthenticated";
      const local = useCartStore.getState().items;
      getServerCart().then((server) => {
        if (justLoggedIn) {
          const merged = mergeCarts(local, server);
          setItems(merged);
          void saveCart(merged);
        } else {
          setItems(server);
        }
      });
    }
    if (
      prevStatus.current === "authenticated" &&
      status === "unauthenticated"
    ) {
      synced.current = false;
      clearCart();
    }
    prevStatus.current = status;
  }, [status, setItems, clearCart]);

  // Persist changes while authenticated (debounced).
  useEffect(() => {
    if (status !== "authenticated" || !synced.current) return;
    clearTimeout(saveTimer.current ?? undefined);
    saveTimer.current = setTimeout(() => {
      void saveCart(items);
    }, 600);
    return () => clearTimeout(saveTimer.current ?? undefined);
  }, [items, status]);

  return null;
}

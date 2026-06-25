"use client";

import { ShoppingCart } from "lucide-react";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";

interface AddToCartButtonProps {
  variantId: string | null;
  className?: string;
}

export function AddToCartButton({
  variantId,
  className,
}: AddToCartButtonProps) {
  const { requireAuth } = useRequireAuth();
  const addItem = useCartStore((s) => s.addItem);

  const outOfStock = !variantId;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId) return;
    if (!requireAuth()) return;
    addItem(variantId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      className={cn(
        "bg-brand-500 shadow-brand-500/25 hover:bg-brand-600 mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none",
        className,
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
    </button>
  );
}

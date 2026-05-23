"use client";

import { ShoppingCart } from "lucide-react";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";

interface AddToCartButtonProps {
  productId: string;
  className?: string;
}

export function AddToCartButton({ productId, className }: AddToCartButtonProps) {
  const { requireAuth } = useRequireAuth();
  const addItem = useCartStore((s) => s.addItem);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    addItem(productId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-lg active:scale-[0.98]",
        className,
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      Thêm vào giỏ
    </button>
  );
}

"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import type { CartLine } from "@/modules/cart/actions";
import { useCartStore } from "@/store/use-cart-store";

interface CartItemRowProps {
  item: CartLine;
  quantity: number;
}

export function CartItemRow({ item, quantity }: CartItemRowProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const unitPrice = item.salePrice ?? item.price;
  const maxQty = Math.min(10, item.stock);

  return (
    <div className="flex gap-4 border-b border-neutral-100 py-5 last:border-0">
      <Link
        href={`/products/${item.productSlug}`}
        className="focus-visible:ring-brand-500/50 relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:h-28 sm:w-28"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={item.image}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="112px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.productSlug}`}
            className="hover:text-brand-600 focus-visible:ring-brand-500/50 line-clamp-2 rounded-sm text-sm font-medium text-neutral-900 focus-visible:ring-2 focus-visible:outline-none sm:text-base"
          >
            {item.productName}
          </Link>
          <p className="mt-0.5 text-xs text-neutral-500">
            Phiên bản: {item.variantName}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex items-center rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, quantity - 1)}
              className="focus-visible:ring-brand-500/50 flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Giảm số lượng"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span
              className="w-8 text-center text-sm font-medium tabular-nums"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, quantity + 1)}
              className="focus-visible:ring-brand-500/50 flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              disabled={quantity >= maxQty}
              aria-label="Tăng số lượng"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-brand-600 text-sm font-bold tabular-nums">
              {formatPrice(unitPrice * quantity)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.variantId)}
              className="focus-visible:ring-brand-500/50 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Xóa sản phẩm"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

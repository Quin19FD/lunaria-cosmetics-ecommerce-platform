"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import type { Product } from "@/modules/products";
import { useCartStore } from "@/store/use-cart-store";

interface CartItemRowProps {
  product: Product;
  quantity: number;
}

export function CartItemRow({ product, quantity }: CartItemRowProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 border-b border-neutral-100 py-5 last:border-0">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-28 sm:w-28"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-medium text-neutral-900 hover:text-brand-500 sm:text-base"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-neutral-400">{product.category}</p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Giảm số lượng"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-40"
              disabled={quantity >= 10}
              aria-label="Tăng số lượng"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Price + Remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-brand-500">
              {formatPrice(product.price * quantity)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(product.id)}
              className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
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

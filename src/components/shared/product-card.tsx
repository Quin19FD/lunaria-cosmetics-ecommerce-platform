import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/modules/products"

interface ProductCardProps {
  product: Product;
  className?: string;
}

const badgeConfig = {
  bestseller: { label: "BÁN CHẠY", bgColor: "bg-red-500" },
  new: { label: "MỚI", bgColor: "bg-green-500" },
  hot: { label: "HOT ITEM", bgColor: "bg-orange-500" },
  sale: { label: "GIẢM GIÁ", bgColor: "bg-brand-500" },
};

export function ProductCard({ product, className }: ProductCardProps) {
  const filledStars = Math.round(product.rating);

  const badge = product.badge ? badgeConfig[product.badge] : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-white transition-shadow duration-300 hover:shadow-lg",
        className,
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full flex-shrink-0 overflow-hidden rounded-t-2xl bg-neutral-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              "absolute left-3 top-3 rounded-lg px-3 py-1 text-xs font-semibold text-white",
              badge.bgColor,
            )}
          >
            {badge.label}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Category */}
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={cn(
                  "transition-colors",
                  i < filledStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-neutral-200 text-neutral-200",
                )}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-brand-500">
            {formatPrice(product.price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.salePrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton productId={product.id} />
      </div>
    </Link>
  );
}

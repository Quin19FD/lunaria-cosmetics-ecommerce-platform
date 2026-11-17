import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Tilt3D, Tilt3DLayer, Tilt3DSheen } from "@/components/shared/tilt-3d";
import { WishlistButton } from "@/components/shared/wishlist-button";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/modules/products";

interface ProductCardProps {
  product: Product;
  className?: string;
}

// One shade darker than before so the white 12px label clears WCAG AA.
const badgeConfig = {
  bestseller: { label: "BÁN CHẠY", bgColor: "bg-red-600" },
  new: { label: "MỚI", bgColor: "bg-green-700" },
  hot: { label: "HOT ITEM", bgColor: "bg-orange-700" },
  sale: { label: "GIẢM GIÁ", bgColor: "bg-brand-600" },
};

export function ProductCard({ product, className }: ProductCardProps) {
  const filledStars = Math.round(product.rating);

  const badge = product.badge ? badgeConfig[product.badge] : null;
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <Tilt3D className="group/card h-full rounded-2xl">
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          // No overflow-hidden here: clipping would flatten the 3D layers.
          "flex h-full flex-col rounded-2xl bg-white ring-1 ring-neutral-900/5 transition-shadow duration-300 [transform-style:preserve-3d]",
          "hover:shadow-brand-900/10 hover:shadow-xl",
          "focus-visible:ring-brand-500/60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 focus-visible:outline-none",
          className,
        )}
      >
        {/* Image — lifts towards the viewer while the card is tilted */}
        <Tilt3DLayer
          depth={28}
          className="relative aspect-[4/5] w-full flex-shrink-0 overflow-hidden rounded-t-2xl bg-neutral-100"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          <Tilt3DSheen />

          {/* Wishlist heart — stops propagation so it doesn't navigate */}
          <WishlistButton
            productId={product.id}
            className="focus-visible:ring-brand-500/60 absolute top-2 right-2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white focus-visible:ring-2 focus-visible:outline-none"
          />

          {/* Badge */}
          {badge && (
            <div
              className={cn(
                "absolute top-3 left-3 z-10 rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white shadow-sm sm:text-xs",
                badge.bgColor,
              )}
            >
              {badge.label}
            </div>
          )}
        </Tilt3DLayer>

        {/* Content — rises a little less than the image, for depth */}
        <Tilt3DLayer
          depth={12}
          className="flex flex-1 flex-col gap-2 p-3 sm:p-4"
        >
          {/* Category */}
          <div className="truncate text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="group-hover/card:text-brand-700 line-clamp-2 min-h-[2.5rem] text-sm leading-5 font-medium text-neutral-900 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div
              className="flex gap-0.5"
              role="img"
              aria-label={`Đánh giá ${filledStars}/5`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  aria-hidden
                  className={cn(
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
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-brand-600 font-bold tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-neutral-500 tabular-nums line-through">
                {formatPrice(product.salePrice)}
              </span>
            )}
          </div>

          <AddToCartButton
            variantId={inStock ? product.defaultVariantId : null}
          />
        </Tilt3DLayer>
      </Link>
    </Tilt3D>
  );
}

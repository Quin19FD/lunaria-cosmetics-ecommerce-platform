"use client";

import {
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { WishlistButton } from "@/components/shared/wishlist-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/modules/products";
import { useCartStore } from "@/store/use-cart-store";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.defaultVariantId ?? product.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  );
  const effectivePrice = selectedVariant
    ? (selectedVariant.salePrice ?? selectedVariant.price)
    : product.price;
  const originalPrice = selectedVariant?.price ?? product.price;
  const hasSale =
    selectedVariant?.salePrice != null &&
    selectedVariant.salePrice < selectedVariant.price;
  const stock = selectedVariant?.stock ?? 0;
  const maxQty = Math.min(10, stock);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQty) {
      setQuantity(newQuantity);
    }
  };

  const selectVariant = (id: string) => {
    setSelectedVariantId(id);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!selectedVariant || stock <= 0) return;
    addItem(selectedVariant.id, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!selectedVariant || stock <= 0) return;
    addItem(selectedVariant.id, quantity);
    router.push("/cart");
  };

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <h1 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
        {product.name}
      </h1>

      {/* Rating Row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={cn(
                i < Math.round(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-neutral-200 text-neutral-200",
              )}
            />
          ))}
        </div>
        <span className="text-sm text-neutral-600">
          ({product.reviewCount} đánh giá)
        </span>
      </div>

      {/* Price Section */}
      <div className="flex items-baseline gap-3">
        <span className="text-brand-500 text-2xl font-bold">
          {formatPrice(effectivePrice)}
        </span>
        {hasSale && (
          <span className="text-lg text-neutral-400 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {/* Variant Section */}
      {product.variants.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900">PHIÊN BẢN</h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant) => {
              const out = variant.stock <= 0;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => selectVariant(variant.id)}
                  disabled={out}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                    variant.id === selectedVariantId
                      ? "border-brand-500 bg-brand-50 text-brand-600"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300",
                    out && "cursor-not-allowed text-neutral-300 line-through",
                  )}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-neutral-500">
            {stock > 0 ? `Còn ${stock} sản phẩm` : "Tạm hết hàng"}
          </p>
        </div>
      )}

      {/* Quantity Section */}
      <div className="space-y-3">
        <h3 className="font-medium text-neutral-900">SỐ LƯỢNG</h3>
        <div className="flex w-fit items-center rounded-lg border border-neutral-200">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus size={18} />
          </button>
          <span className="w-12 text-center font-medium text-neutral-900">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQty}
            className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          size="lg"
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className="flex-1"
        >
          <ShoppingCart size={20} />
          Thêm vào giỏ
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={handleBuyNow}
          disabled={stock <= 0}
          className="flex-1"
        >
          Mua ngay
        </Button>
        <WishlistButton
          productId={product.id}
          className="h-12 w-12 flex-shrink-0 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
        />
      </div>

      {/* Trust Badges */}
      <div className="space-y-3 border-t border-neutral-200 pt-4">
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <Truck size={20} className="text-brand-500 flex-shrink-0" />
          <span>Miễn phí vận chuyển cho đơn hàng từ 500k</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <ShieldCheck size={20} className="text-brand-500 flex-shrink-0" />
          <span>Sản phẩm chính hãng 100%</span>
        </div>
      </div>
    </div>
  );
}

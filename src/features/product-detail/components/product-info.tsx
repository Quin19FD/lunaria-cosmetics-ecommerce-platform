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

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/modules/products";
import { useCartStore } from "@/store/use-cart-store";

interface ProductInfoProps {
  product: Product;
}

const COLORS = [
  { name: "Rose Pink", hex: "#E8A0BF" },
  { name: "Deep Berry", hex: "#8B2252" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Nude", hex: "#D2B48C" },
];

export function ProductInfo({ product }: ProductInfoProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    addItem(product.id, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    addItem(product.id, quantity);
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
              className="fill-yellow-400 text-yellow-400"
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
          {formatPrice(product.salePrice || product.price)}
        </span>
        {product.salePrice && (
          <span className="text-lg text-neutral-400 line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Color Section */}
      <div className="space-y-3">
        <h3 className="font-medium text-neutral-900">MÀU SẮC</h3>
        <div className="flex gap-4">
          {COLORS.map((color, index) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(index)}
              className={cn(
                "relative h-10 w-10 rounded-full transition-all duration-200",
                selectedColor === index &&
                  "ring-brand-500 ring-2 ring-offset-2",
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select ${color.name}`}
              title={color.name}
            />
          ))}
        </div>
        <p className="text-sm text-neutral-600">{COLORS[selectedColor].name}</p>
      </div>

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
            disabled={quantity >= 10}
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
          className="flex-1"
        >
          <ShoppingCart size={20} />
          Thêm vào giỏ
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={handleBuyNow}
          className="flex-1"
        >
          Mua ngay
        </Button>
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

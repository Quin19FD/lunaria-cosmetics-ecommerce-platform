import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/modules/products";

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between lg:mb-12">
          <div>
            <h2 className="mb-2 font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
              Sản Phẩm Bán Chạy
            </h2>
            <p className="text-neutral-500">
              Được yêu thích nhất bởi cộng đồng yêu làm đẹp
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100",
              )}
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "border-brand-500 bg-brand-500 hover:bg-brand-600 flex h-10 w-10 items-center justify-center rounded-full border text-white",
              )}
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

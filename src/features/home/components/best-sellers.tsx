import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/modules/products"

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
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
                "w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100"
              )}
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 rounded-full border border-brand-500 bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600"
              )}
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

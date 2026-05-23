import Link from "next/link";

import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/modules/products";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold">Bạn cũng có thể thích</h2>
        <Link
          href="/products"
          className="text-brand-500 font-medium hover:opacity-80 transition-opacity"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

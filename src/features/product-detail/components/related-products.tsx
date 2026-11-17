import Link from "next/link";

import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/modules/products";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold">Bạn cũng có thể thích</h2>
        <Link
          href="/products"
          className="text-brand-500 font-medium transition-opacity hover:opacity-80"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/modules/products";

interface CollectionProductsProps {
  products: Product[];
  total: number;
}

export function CollectionProducts({ products }: CollectionProductsProps) {
  return (
    <section
      id="products"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
    >
      {/* Section header */}
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
          Những Sản Phẩm Thiết Yếu
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Các yếu tố được tuyển chọn cho vẻ rạng rỡ thanh khiết.
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

import { ProductCard } from "@/components/shared/product-card";
import { productService } from "@/modules/products";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = (await searchParams).q?.trim() ?? "";

  if (!q) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-neutral-500">Nhập từ khóa để tìm kiếm.</p>
      </div>
    );
  }

  const results = await productService.search(q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Kết quả cho &quot;{q}&quot;
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {results.length} sản phẩm
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">
          Không tìm thấy sản phẩm nào phù hợp.
        </p>
      )}
    </div>
  );
}

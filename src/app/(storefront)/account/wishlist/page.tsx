import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { listWishlist } from "@/modules/wishlist/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sản phẩm yêu thích",
};

export default async function WishlistPage() {
  const products = await listWishlist();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-neutral-900">
          Sản phẩm yêu thích
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {products.length} sản phẩm
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 py-12 text-center">
          <p className="text-sm text-neutral-500">
            Bạn chưa có sản phẩm yêu thích nào.
          </p>
          <Button asChild variant="default" size="sm">
            <Link href="/products">Khám phá sản phẩm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="border border-neutral-100"
            />
          ))}
        </div>
      )}
    </div>
  );
}

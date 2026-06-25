"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  ProductFilters,
  ProductsSortBar,
} from "@/features/products";
import type { Category } from "@/modules/catalog";
import type { SkinType, SortOption } from "@/modules/products";
import {
  getFilteredProducts,
  getFilterCategories,
} from "@/modules/products/actions";
import type { ProductListResult } from "@/modules/products/services/product.service";

export default function ProductsPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [sort, setSort] = useState<SortOption>("popular");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [result, setResult] = useState<ProductListResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Load filter categories once.
  useEffect(() => {
    let active = true;
    getFilterCategories().then((cats) => {
      if (active) setCategories(cats);
    });
    return () => {
      active = false;
    };
  }, []);

  // Re-fetch the product list whenever a filter, sort, or page changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    getFilteredProducts({
      category: category ?? undefined,
      skinType: skinType ?? undefined,
      sort,
      page,
    }).then((res) => {
      if (!active) return;
      setResult(res);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [category, skinType, sort, page]);

  const handleCategoryChange = useCallback((cat: string | null) => {
    setCategory(cat);
    setPage(1);
  }, []);

  const handleSkinTypeChange = useCallback((st: string | null) => {
    setSkinType(st as SkinType | null);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((s: string) => {
    setSort(s as SortOption);
    setPage(1);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Sort bar */}
      <ProductsSortBar
        sort={sort}
        onSortChange={handleSortChange}
        onToggleFilters={() => setShowMobileFilters(true)}
        totalProducts={result?.total ?? 0}
      />

      <div className="mt-6 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 flex-shrink-0 lg:block">
          <ProductFilters
            categories={categories}
            activeCategory={category}
            activeSkinType={skinType}
            onCategoryChange={handleCategoryChange}
            onSkinTypeChange={handleSkinTypeChange}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="relative ml-auto flex h-full w-80 flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4" />
                  Bộ lọc
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ProductFilters
                  categories={categories}
                  activeCategory={category}
                  activeSkinType={skinType}
                  onCategoryChange={handleCategoryChange}
                  onSkinTypeChange={handleSkinTypeChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
              ))}
            </div>
          ) : result && result.data.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                {result.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {result.totalPages > 1 && (
                <Pagination
                  currentPage={result.page}
                  totalPages={result.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium text-neutral-700">
                Không tìm thấy sản phẩm
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                Thử thay đổi bộ lọc để xem thêm sản phẩm
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setCategory(null);
                  setSkinType(null);
                  setPage(1);
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

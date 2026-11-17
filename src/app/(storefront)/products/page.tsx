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
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

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
    setFailed(false);
    getFilteredProducts({
      category: category ?? undefined,
      skinType: skinType ?? undefined,
      sort,
      page,
    })
      .then((res) => {
        if (active) setResult(res);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, skinType, sort, page, attempt]);

  // Close the mobile filter drawer with Escape.
  useEffect(() => {
    if (!showMobileFilters) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowMobileFilters(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showMobileFilters]);

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
          <div
            className="fixed inset-0 z-50 flex lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Bộ lọc"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="relative ml-auto flex h-full w-[min(20rem,88vw)] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4" />
                  Bộ lọc
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Đóng bộ lọc"
                  autoFocus
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
        <div className="min-w-0 flex-1">
          {loading ? (
            <div
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4"
              role="status"
              aria-label="Đang tải sản phẩm"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : failed ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
              <p className="text-lg font-medium text-neutral-700">
                Không tải được sản phẩm
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Kiểm tra kết nối mạng rồi thử lại.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setAttempt((n) => n + 1)}
              >
                Thử lại
              </Button>
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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
              <p className="text-lg font-medium text-neutral-700">
                Không tìm thấy sản phẩm
              </p>
              <p className="mt-1 text-sm text-neutral-500">
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

/** Same proportions as ProductCard, so the grid does not jump on load. */
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-900/5">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-2 p-3 sm:p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-3 h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

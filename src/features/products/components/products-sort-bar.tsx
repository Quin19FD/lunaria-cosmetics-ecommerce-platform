"use client";

import { SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ProductsSortBarProps {
  sort: string;
  onSortChange: (sort: string) => void;
  onToggleFilters: () => void;
  totalProducts: number;
}

const SORT_OPTIONS = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "rating", label: "Đánh giá cao" },
];

export function ProductsSortBar({
  sort,
  onSortChange,
  onToggleFilters,
  totalProducts,
}: ProductsSortBarProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Filter Button - Mobile Only */}
      <button
        onClick={onToggleFilters}
        className="lg:hidden flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4 text-neutral-600" />
        <span className="text-sm font-medium text-neutral-700">Bộ lọc</span>
      </button>

      {/* Center: Total Products */}
      <div className="hidden md:block flex-1 px-4">
        <p className="text-sm text-neutral-500">
          Hiển thị {totalProducts} sản phẩm
        </p>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-neutral-700">Sắp xếp:</label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className={cn(
            "border border-neutral-200 rounded-lg px-3 py-2 text-sm",
            "bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none",
            "cursor-pointer transition-colors hover:border-neutral-300"
          )}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

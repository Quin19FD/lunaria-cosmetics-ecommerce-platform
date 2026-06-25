"use client";

import { ChevronDown, Eye, Sparkles } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { Category } from "@/modules/catalog";

export interface ProductFiltersProps {
  categories: Category[];
  activeCategory: string | null;
  activeSkinType: string | null;
  onCategoryChange: (cat: string | null) => void;
  onSkinTypeChange: (st: string | null) => void;
}

const SKIN_TYPE_LABELS: Record<string, string> = {
  "da-kho": "Da khô",
  "da-dau": "Da dầu",
  "da-nhay-cam": "Da nhạy cảm",
  "da-thuong": "Da thường",
};

export function ProductFilters({
  categories,
  activeCategory,
  activeSkinType,
  onCategoryChange,
  onSkinTypeChange,
}: ProductFiltersProps) {
  const [expandedCategory, setExpandedCategory] = useState(true);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xs tracking-widest text-neutral-400 uppercase">
          TỐI ƯU HÓA TÌM KIẾM
        </h2>
      </div>

      {/* Category Section */}
      <div className="mb-6 border-b border-neutral-200 pb-6">
        <button
          onClick={() => setExpandedCategory(!expandedCategory)}
          className="mb-4 flex w-full items-center justify-between"
        >
          <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
            Danh mục
          </h3>
          <ChevronDown
            size={16}
            className={cn(
              "text-neutral-400 transition-transform",
              expandedCategory && "rotate-180",
            )}
          />
        </button>

        {expandedCategory && (
          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() =>
                  onCategoryChange(
                    activeCategory === category.slug ? null : category.slug,
                  )
                }
                className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80"
              >
                <div
                  className={cn(
                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2",
                    activeCategory === category.slug
                      ? "bg-brand-500 border-brand-500"
                      : "border-neutral-300",
                  )}
                >
                  {activeCategory === category.slug && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    activeCategory === category.slug
                      ? "text-brand-500 font-medium"
                      : "text-neutral-700",
                  )}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="mb-6 border-b border-neutral-200 pb-6">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
            Khoảng giá
          </h3>
          <Eye size={16} className="text-neutral-400" />
        </div>

        <div className="space-y-3">
          {/* Visual range bar */}
          <div className="from-brand-500 to-brand-300 h-1 w-full rounded-full bg-gradient-to-r" />

          {/* Price labels */}
          <div className="flex justify-between text-xs text-neutral-600">
            <span>0đ</span>
            <span>2.000.000đ</span>
          </div>
        </div>
      </div>

      {/* Skin Type Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
            Loại da
          </h3>
          <Sparkles size={16} className="text-neutral-400" />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(SKIN_TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() =>
                onSkinTypeChange(activeSkinType === key ? null : key)
              }
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                activeSkinType === key
                  ? "bg-brand-500 text-white"
                  : "hover:border-brand-300 border border-neutral-300 text-neutral-700",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

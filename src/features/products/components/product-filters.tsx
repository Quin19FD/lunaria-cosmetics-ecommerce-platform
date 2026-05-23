"use client";

import { ChevronDown, Eye, Sparkles } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface ProductFiltersProps {
  categories: string[];
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
      <div className="border-b border-neutral-200 pb-6 mb-6">
        <button
          onClick={() => setExpandedCategory(!expandedCategory)}
          className="mb-4 flex w-full items-center justify-between"
        >
          <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
            Danh mục
          </h3>
          <ChevronDown
            size={16}
            className={cn(
              "text-neutral-400 transition-transform",
              expandedCategory && "rotate-180"
            )}
          />
        </button>

        {expandedCategory && (
          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  onCategoryChange(
                    activeCategory === category ? null : category
                  )
                }
                className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    activeCategory === category
                      ? "bg-brand-500 border-brand-500"
                      : "border-neutral-300"
                  )}
                >
                  {activeCategory === category && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    activeCategory === category
                      ? "text-brand-500 font-medium"
                      : "text-neutral-700"
                  )}
                >
                  {category}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="border-b border-neutral-200 pb-6 mb-6">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
            Khoảng giá
          </h3>
          <Eye size={16} className="text-neutral-400" />
        </div>

        <div className="space-y-3">
          {/* Visual range bar */}
          <div className="w-full h-1 bg-gradient-to-r from-brand-500 to-brand-300 rounded-full" />

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
          <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
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
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeSkinType === key
                  ? "bg-brand-500 text-white"
                  : "border border-neutral-300 text-neutral-700 hover:border-brand-300"
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

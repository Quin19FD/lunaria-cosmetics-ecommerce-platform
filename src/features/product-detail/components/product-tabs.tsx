"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { cn, formatDate } from "@/lib/utils";
import type { ProductReview } from "@/modules/products/review.actions";

import { ReviewForm } from "./review-form";

export interface ProductTabsProps {
  description: string;
  ingredients?: string | null;
  howToUse?: string | null;
  reviews: ProductReview[];
  productId: string;
  slug: string;
}

export const ProductTabs = ({
  description,
  ingredients,
  howToUse,
  reviews,
  productId,
  slug,
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "Mô tả" },
    { id: 1, label: "Thành phần" },
    { id: 2, label: "Hướng dẫn sử dụng" },
    { id: 3, label: `Đánh giá (${reviews.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="border-b border-neutral-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "border-b-2 border-transparent py-3 font-medium transition-colors duration-200",
                activeTab === tab.id
                  ? "text-brand-500 border-brand-500 border-b-2"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="prose prose-sm leading-relaxed text-neutral-600">
        {activeTab === 0 && (
          <div>
            <p className="whitespace-pre-line">{description}</p>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            {ingredients ? (
              <p className="whitespace-pre-line">{ingredients}</p>
            ) : (
              <p className="text-neutral-500">
                Chưa có thông tin thành phần cho sản phẩm này.
              </p>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div>
            {howToUse ? (
              <p className="whitespace-pre-line">{howToUse}</p>
            ) : (
              <p className="text-neutral-500">
                Chưa có hướng dẫn sử dụng cho sản phẩm này.
              </p>
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div>
            {reviews.length === 0 ? (
              <p className="text-neutral-500">Chưa có đánh giá</p>
            ) : (
              <ul className="space-y-6">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="border-b border-neutral-100 pb-6 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-neutral-900">
                        {review.authorName}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={cn(
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-300",
                          )}
                        />
                      ))}
                    </div>
                    {review.title && (
                      <p className="mt-2 font-medium text-neutral-800">
                        {review.title}
                      </p>
                    )}
                    {review.comment && (
                      <p className="mt-1 text-neutral-600">{review.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <ReviewForm productId={productId} slug={slug} />
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createReview } from "@/modules/products/review.actions";

interface ReviewFormProps {
  productId: string;
  slug: string;
}

export function ReviewForm({ productId, slug }: ReviewFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (status === "loading") {
    return (
      <div className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
        Đang tải...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center">
        <p className="text-sm text-neutral-600">
          Vui lòng đăng nhập để viết đánh giá cho sản phẩm này.
        </p>
        <Button asChild className="mt-4">
          <Link href="/auth/login">Đăng nhập</Link>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-sm font-medium text-green-700">
          Cảm ơn bạn đã đánh giá sản phẩm!
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await createReview({
      productId,
      slug,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
    });

    setSubmitting(false);

    if (result.ok) {
      setSuccess(true);
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 border-t border-neutral-200 pt-6"
    >
      <h4 className="font-medium text-neutral-900">Viết đánh giá của bạn</h4>

      {/* Star rating */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const filled = (hover || rating) >= value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${value} sao`}
              className="p-0.5"
            >
              <Star
                size={24}
                className={cn(
                  "transition-colors",
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-neutral-300",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề (tùy chọn)"
        className="focus:border-brand-500 focus:ring-brand-500/30 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:outline-none"
      />

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
        rows={4}
        className="focus:border-brand-500 focus:ring-brand-500/30 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:outline-none"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
      </Button>
    </form>
  );
}

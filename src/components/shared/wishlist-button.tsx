"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";
import { toggleWishlist } from "@/modules/wishlist/actions";
import { useWishlistStore } from "@/store/use-wishlist-store";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { requireAuth } = useRequireAuth();
  const active = useWishlistStore((s) => s.ids.includes(productId));
  const add = useWishlistStore((s) => s.add);
  const remove = useWishlistStore((s) => s.remove);
  const [pending, setPending] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    // Cards are links — keep the click from navigating.
    e.stopPropagation();
    e.preventDefault();

    if (!requireAuth()) return;
    if (pending) return;

    const wasActive = active;
    // Optimistic toggle.
    if (wasActive) {
      remove(productId);
    } else {
      add(productId);
    }

    setPending(true);
    try {
      const result = await toggleWishlist(productId);
      if (!result.ok) {
        // Revert on failure.
        if (wasActive) {
          add(productId);
        } else {
          remove(productId);
        }
      }
    } catch {
      // Network/server error — revert to the previous state.
      if (wasActive) {
        add(productId);
      } else {
        remove(productId);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      className={cn(
        "flex items-center justify-center transition-colors",
        className,
      )}
    >
      <Heart
        size={18}
        className={cn(
          "transition-colors",
          active
            ? "fill-brand-500 text-brand-500"
            : "fill-transparent text-neutral-500 hover:text-brand-500",
        )}
      />
    </button>
  );
}

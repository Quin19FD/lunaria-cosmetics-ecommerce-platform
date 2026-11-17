"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItemRow, CartSummary, EmptyCart } from "@/features/cart";
import { useMounted } from "@/hooks/use-mounted";
import { getCartItems, type CartLine } from "@/modules/cart/actions";
import { useCartStore } from "@/store/use-cart-store";

export default function CartPage() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);

  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const ids = useMemo(() => items.map((i) => i.variantId), [items]);

  useEffect(() => {
    if (!mounted) return;
    if (ids.length === 0) {
      setLines([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setFailed(false);
    getCartItems(ids)
      .then((result) => {
        if (!active) return;
        setLines(result);
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
  }, [mounted, ids, attempt]);

  const cartLines = useMemo(() => {
    const byVariant = new Map(lines.map((l) => [l.variantId, l]));
    return items
      .map((item) => {
        const line = byVariant.get(item.variantId);
        return line ? { line, quantity: item.quantity } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x != null);
  }, [lines, items]);

  const subtotal = cartLines.reduce(
    (sum, { line, quantity }) =>
      sum + (line.salePrice ?? line.price) * quantity,
    0,
  );

  const totalItems = cartLines.reduce((sum, { quantity }) => sum + quantity, 0);

  if (!mounted || loading) {
    return <CartSkeleton />;
  }

  if (failed) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-neutral-900">
          Không tải được giỏ hàng
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Có lỗi kết nối. Sản phẩm trong giỏ vẫn được giữ nguyên.
        </p>
        <Button className="mt-6" onClick={() => setAttempt((n) => n + 1)}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (cartLines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
        Giỏ hàng
      </h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="min-w-0 flex-1 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
          {cartLines.map(({ line, quantity }) => (
            <CartItemRow key={line.variantId} item={line} quantity={quantity} />
          ))}
        </div>

        <div className="w-full flex-shrink-0 lg:w-80">
          <CartSummary subtotal={subtotal} itemCount={totalItems} />
        </div>
      </div>
    </div>
  );
}

/** Mirrors the loaded layout so nothing jumps when lines arrive. */
function CartSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      role="status"
      aria-label="Đang tải giỏ hàng"
    >
      <Skeleton className="h-8 w-40" />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="min-w-0 flex-1 space-y-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-24 flex-shrink-0 rounded-xl sm:h-28 sm:w-28" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="mt-6 h-8 w-28" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-80 w-full flex-shrink-0 rounded-2xl lg:w-80" />
      </div>
    </div>
  );
}

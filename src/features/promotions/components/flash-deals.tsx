"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Timer, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn, formatPrice } from "@/lib/utils";
import { promotionService } from "@/modules/promotions";
import { useCartStore } from "@/store/use-cart-store";

function useCountdown() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((t) => {
        const total = t.h * 3600 + t.m * 60 + t.s - 1;
        if (total <= 0) return { h: 0, m: 0, s: 0 };
        return {
          h: Math.floor(total / 3600),
          m: Math.floor((total % 3600) / 60),
          s: total % 60,
        };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function FlashDeals() {
  const deals = promotionService.getFlashDeals();
  const countdown = useCountdown();
  const { requireAuth } = useRequireAuth();
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd(productId: string) {
    if (!requireAuth()) return;
    addItem(productId);
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id="flash-deals"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
    >
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-brand-500" />
            <h2 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
              Flash Deals
            </h2>
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            Giá đặc biệt — Số lượng giới hạn
          </p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2.5 ring-1 ring-brand-100">
          <Timer className="h-4 w-4 text-brand-500" />
          <span className="text-xs font-medium text-brand-600">
            Kết thúc trong
          </span>
          <div className="flex items-center gap-0.5">
            {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map(
              (v, i) => (
                <span key={i} className="flex items-center">
                  <span className="inline-block min-w-[28px] rounded-md bg-brand-500 px-1.5 py-0.5 text-center text-sm font-bold tabular-nums text-white">
                    {v}
                  </span>
                  {i < 2 && (
                    <span className="mx-0.5 text-xs font-bold text-brand-300">
                      :
                    </span>
                  )}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Deals grid */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {deals.map((deal, i) => {
          const pct = Math.round(
            ((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100,
          );
          const soldPct = Math.round((deal.sold / deal.total) * 100);

          return (
            <motion.div
              key={deal.productId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-shadow hover:shadow-md"
            >
              {/* Image + badge */}
              <Link
                href={`/products/${deal.product.slug}`}
                className="relative aspect-square bg-neutral-50"
              >
                <Image
                  src={deal.product.image}
                  alt={deal.product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="200px"
                />
                <span className="absolute left-2 top-2 rounded-md bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  -{pct}%
                </span>
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col p-3">
                <Link
                  href={`/products/${deal.product.slug}`}
                  className="line-clamp-2 text-xs font-medium text-neutral-800 hover:text-brand-500 sm:text-sm"
                >
                  {deal.product.name}
                </Link>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-brand-500">
                    {formatPrice(deal.dealPrice)}
                  </span>
                  <span className="text-[10px] text-neutral-400 line-through">
                    {formatPrice(deal.originalPrice)}
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-brand-50">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        soldPct > 80
                          ? "bg-red-400"
                          : "bg-brand-500",
                      )}
                      style={{ width: `${soldPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-neutral-400">
                    Đã bán {deal.sold}/{deal.total}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(deal.productId)}
                  className="mt-auto flex items-center justify-center gap-1 rounded-lg bg-brand-500 px-3 py-2 text-[11px] font-medium text-white transition-colors hover:bg-brand-600"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Thêm vào giỏ
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

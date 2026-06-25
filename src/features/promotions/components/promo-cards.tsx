"use client";

import { motion } from "framer-motion";
import { ArrowRight, Copy, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Promotion } from "@/modules/promotions";

interface PromoCardsProps {
  promotions: Promotion[];
}

export function PromoCards({ promotions }: PromoCardsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyCode(code: string, promoId: string) {
    navigator.clipboard.writeText(code);
    setCopiedId(promoId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <section
      id="promotions"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-neutral-700" />
          <h2 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
            Ưu Đãi Đang Diễn Ra
          </h2>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          Nhập mã giảm giá khi thanh toán để nhận ưu đãi
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {promotions.map((promo, i) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl"
          >
            {/* Background image */}
            <div className="relative aspect-[2/1] sm:aspect-[5/2]">
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Dark elegant overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
                <div>
                  <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm">
                    Giảm {promo.discount}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-white sm:text-2xl">
                    {promo.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">{promo.subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Coupon */}
                  <button
                    type="button"
                    onClick={() => copyCode(promo.code, promo.id)}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    <code className="text-sm font-bold tracking-widest text-white">
                      {promo.code}
                    </code>
                    <Copy className="h-3.5 w-3.5 text-white/60" />
                  </button>
                  {copiedId === promo.id && (
                    <span className="text-xs font-medium text-emerald-300">
                      ✓ Đã sao chép
                    </span>
                  )}

                  <Link
                    href="/products"
                    className="ml-auto flex items-center gap-1 text-sm font-medium text-white/80 transition-all hover:translate-x-0.5 hover:text-white"
                  >
                    Mua ngay
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

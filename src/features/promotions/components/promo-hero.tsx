"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PromoHero() {
  return (
    <section className="relative overflow-hidden bg-neutral-900">
      {/* Soft pink glow — not overwhelming */}
      <div className="pointer-events-none absolute -top-32 left-1/3 h-72 w-[500px] rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-60 w-80 rounded-full bg-brand-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-brand-300 uppercase">
            <Sparkles className="h-3 w-3" />
            Ưu đãi đặc biệt
          </span>

          <h1 className="mt-8 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Đặc Quyền
            <br />
            <span className="text-brand-400">Dành Riêng Cho Bạn</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-neutral-400 sm:text-base">
            Sở hữu mỹ phẩm cao cấp với ưu đãi hấp dẫn. Số lượng giới hạn —
            thời gian có hạn.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#flash-deals">Xem Flash Deals</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-white"
            >
              <Link href="#promotions">Tất cả ưu đãi</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

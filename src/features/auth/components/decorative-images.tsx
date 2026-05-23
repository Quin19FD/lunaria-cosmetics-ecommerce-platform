"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function DecorativeImages() {
  return (
    <>
      {/* Left image — perfume bottle */}
      <motion.div
        initial={{ opacity: 0, x: -40, rotate: -8 }}
        animate={{ opacity: 1, x: 0, rotate: -6 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="pointer-events-none absolute top-1/2 -left-4 hidden -translate-y-1/2 lg:block xl:-left-8"
      >
        <div className="relative h-[420px] w-[260px] overflow-hidden rounded-3xl shadow-2xl shadow-black/10 xl:h-[480px] xl:w-[300px]">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=900&fit=crop&q=80"
            alt="Luxury perfume bottle with rose petals"
            fill
            className="object-cover"
            sizes="300px"
            priority
          />
        </div>
      </motion.div>

      {/* Right image — beauty portrait */}
      <motion.div
        initial={{ opacity: 0, x: 40, rotate: 8 }}
        animate={{ opacity: 1, x: 0, rotate: 6 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
        className="pointer-events-none absolute top-1/2 -right-4 hidden -translate-y-1/2 lg:block xl:-right-8"
      >
        <div className="relative h-[420px] w-[260px] overflow-hidden rounded-3xl shadow-2xl shadow-black/10 xl:h-[480px] xl:w-[300px]">
          <Image
            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=900&fit=crop&q=80"
            alt="Beauty portrait with natural makeup"
            fill
            className="object-cover"
            sizes="300px"
            priority
          />
        </div>
      </motion.div>
    </>
  );
}

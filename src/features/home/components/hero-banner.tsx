import Image from "next/image";
import Link from "next/link";

import {
  ParallaxLayer,
  ParallaxScene,
} from "@/components/shared/parallax-scene";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop&q=80";
const HERO_ACCENT_IMAGE =
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=530&fit=crop&q=80";

/**
 * Right-hand depth scene. Far planes (glow, rings) drift against the pointer,
 * near planes (accent card, pearl) drift with it, so the composition reads as
 * real depth. All layers are decorative except the main product image.
 */
function HeroDepthScene() {
  return (
    <ParallaxScene className="aspect-square w-full max-w-md">
      {/* Far plane — soft brand glow */}
      <ParallaxLayer
        aria-hidden
        depth={-14}
        scrollDepth={40}
        className="bg-brand-200/70 absolute inset-[-6%] rounded-full blur-3xl"
      />

      {/* Far plane — orbit rings */}
      <ParallaxLayer
        aria-hidden
        depth={-8}
        scrollDepth={24}
        className="absolute inset-[2%] rounded-full border border-white/80"
      >
        <div className="border-brand-300/70 absolute inset-[9%] rounded-full border border-dashed" />
      </ParallaxLayer>

      {/* Mid plane — main product image on a tilting card */}
      <ParallaxLayer
        depth={14}
        tilt={5}
        scrollDepth={-30}
        className="shadow-brand-900/20 absolute inset-[9%] overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-white/70"
      >
        <Image
          src={HERO_IMAGE}
          alt="Cosmetics Products"
          fill
          priority
          sizes="(max-width: 1024px) 80vw, 448px"
          className="object-cover"
        />
        {/* Glossy edge light — static, sits on the card face */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/30"
        />
      </ParallaxLayer>

      {/* Near plane — accent product card */}
      <ParallaxLayer
        aria-hidden
        depth={32}
        tilt={8}
        scrollDepth={-70}
        className="shadow-brand-900/25 absolute bottom-[4%] left-0 aspect-[3/4] w-[32%] overflow-hidden rounded-2xl bg-white shadow-xl ring-4 ring-white"
      >
        <Image
          src={HERO_ACCENT_IMAGE}
          alt=""
          fill
          sizes="150px"
          className="object-cover"
        />
      </ParallaxLayer>

      {/* Nearest plane — glossy pearl and a brand dot */}
      <ParallaxLayer
        aria-hidden
        depth={46}
        scrollDepth={-110}
        className="shadow-brand-700/30 absolute top-[5%] right-[4%] h-14 w-14 rounded-full bg-[radial-gradient(circle_at_32%_28%,#fff_0%,var(--color-brand-100)_30%,var(--color-brand-300)_70%,var(--color-brand-400)_100%)] shadow-lg lg:h-16 lg:w-16"
      />
      <ParallaxLayer
        aria-hidden
        depth={24}
        scrollDepth={-50}
        className="bg-brand-500 absolute top-[16%] left-[6%] h-3 w-3 rounded-full"
      />
    </ParallaxScene>
  );
}

export function HeroBanner() {
  return (
    <section className="from-brand-50 via-brand-100 to-brand-50 w-full overflow-hidden bg-gradient-to-r">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex flex-col gap-10 lg:flex-row lg:gap-12",
            "lg:items-center",
            "min-h-[500px] lg:min-h-[600px]",
            "py-12 lg:py-16",
          )}
        >
          {/* Left Side - Text Content */}
          <div className="flex flex-col gap-6 lg:flex-1">
            {/* Badge */}
            <div className="inline-flex w-fit">
              <span className="bg-brand-600 rounded-full px-3 py-1 text-xs font-medium tracking-wide text-white">
                NEW COLLECTION 2024
              </span>
            </div>

            {/* Heading — one h1, three visual lines */}
            <h1 className="font-serif text-4xl leading-[1.1] font-bold text-balance text-neutral-900 sm:text-5xl lg:text-6xl">
              <span className="block">Tỏa Sáng Vẻ Đẹp</span>
              <span className="block">
                <span className="text-brand-700 italic">Tự Nhiên</span> Của
              </span>
              <span className="block">Bạn</span>
            </h1>

            {/* Description */}
            <p className="max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg">
              Khám phá bộ sưu tập mỹ phẩm thuần chay được thiết kế riêng để nuôi
              dưỡng và làm rạng rỡ làn da của bạn mỗi ngày.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/products">Mua ngay</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-brand-300 hover:border-brand-400 text-brand-700 w-full bg-white/70 backdrop-blur-sm hover:bg-white sm:w-auto"
              >
                <Link href="/collections">Xem BST mới</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Layered depth scene */}
          <div className="hidden items-center justify-center md:flex lg:flex-1">
            <HeroDepthScene />
          </div>
        </div>
      </div>
    </section>
  );
}

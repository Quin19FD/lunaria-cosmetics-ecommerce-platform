import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  return (
    <section className="from-brand-50 via-brand-100 to-brand-50 w-full bg-gradient-to-r">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex flex-col gap-8 lg:flex-row lg:gap-12",
            "lg:items-center",
            "min-h-[500px] lg:min-h-[600px]",
            "py-12 lg:py-16",
          )}
        >
          {/* Left Side - Text Content */}
          <div className="flex flex-col gap-6 lg:flex-1">
            {/* Badge */}
            <div className="inline-flex w-fit">
              <span className="bg-brand-500 rounded-full px-3 py-1 text-xs font-medium text-white">
                NEW COLLECTION 2024
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <h1 className="font-serif text-4xl font-bold text-neutral-900 sm:text-5xl lg:text-6xl">
                Tỏa Sáng Vẻ Đẹp
              </h1>
              <h1 className="font-serif text-4xl font-bold text-neutral-900 sm:text-5xl lg:text-6xl">
                <span className="italic">Tự Nhiên</span> Của
              </h1>
              <h1 className="font-serif text-4xl font-bold text-neutral-900 sm:text-5xl lg:text-6xl">
                Bạn
              </h1>
            </div>

            {/* Description */}
            <p className="max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg">
              Khám phá bộ sưu tập mỹ phẩm thuần chay được thiết kế riêng để nuôi
              dưỡng và làm rạng rỡ làn da của bạn mỗi ngày.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Mua ngay
                </Button>
              </Link>
              <Link href="/collections">
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "w-full sm:w-auto",
                    "border-white bg-white/10 text-white hover:border-white hover:bg-white/20",
                  )}
                >
                  Xem BST mới
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="hidden items-center justify-center md:flex lg:flex-1">
            <div className="relative aspect-square w-full max-w-md">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop&q=80"
                alt="Cosmetics Products"
                fill
                priority
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

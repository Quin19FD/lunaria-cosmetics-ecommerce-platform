import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-brand-50 via-brand-100 to-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex flex-col lg:flex-row gap-8 lg:gap-12",
          "lg:items-center",
          "min-h-[500px] lg:min-h-[600px]",
          "py-12 lg:py-16"
        )}>
          {/* Left Side - Text Content */}
          <div className="flex flex-col gap-6 lg:flex-1">
            {/* Badge */}
            <div className="inline-flex w-fit">
              <span className="bg-brand-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                NEW COLLECTION 2024
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-neutral-900">
                Tỏa Sáng Vẻ Đẹp
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-neutral-900">
                <span className="italic">Tự Nhiên</span> Của
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-neutral-900">
                Bạn
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-md leading-relaxed">
              Khám phá bộ sưu tập mỹ phẩm thuần chay được thiết kế riêng để nuôi dưỡng và làm rạng rỡ làn da của bạn mỗi ngày.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
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
                    "border-white bg-white/10 text-white hover:bg-white/20 hover:border-white"
                  )}
                >
                  Xem BST mới
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="hidden md:flex lg:flex-1 justify-center items-center">
            <div className="relative w-full aspect-square max-w-md">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop&q=80"
                alt="Cosmetics Products"
                fill
                priority
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Category } from "@/modules/catalog"

interface FeaturedCategoriesProps {
  categories: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header with title and all categories link */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
          Danh Mục Nổi Bật
        </h2>
        <Link
          href="/products"
          className="text-brand-500 font-medium hover:opacity-80 transition-opacity"
        >
          Tất cả danh mục →
        </Link>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group text-center"
          >
            {/* Category image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl mb-3 bg-neutral-100">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className={cn(
                  "object-cover",
                  "transition-transform duration-300 ease-out",
                  "group-hover:scale-105"
                )}
              />
            </div>
            {/* Category name */}
            <p className="text-sm font-medium text-neutral-900 line-clamp-2">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

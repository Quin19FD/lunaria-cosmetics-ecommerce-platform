import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Category } from "@/modules/catalog";

interface FeaturedCategoriesProps {
  categories: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Header with title and all categories link */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-neutral-950 sm:text-3xl">
          Danh Mục Nổi Bật
        </h2>
        <Link
          href="/products"
          className="text-brand-500 font-medium transition-opacity hover:opacity-80"
        >
          Tất cả danh mục →
        </Link>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group text-center"
          >
            {/* Category image */}
            <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className={cn(
                  "object-cover",
                  "transition-transform duration-300 ease-out",
                  "group-hover:scale-105",
                )}
              />
            </div>
            {/* Category name */}
            <p className="line-clamp-2 text-sm font-medium text-neutral-900">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

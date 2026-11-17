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
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h2 className="font-serif text-2xl font-bold text-neutral-950 sm:text-3xl">
          Danh Mục Nổi Bật
        </h2>
        <Link
          href="/products"
          className="text-brand-600 hover:text-brand-700 focus-visible:ring-brand-500/50 rounded-sm text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none sm:text-base"
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
            className="group focus-visible:ring-brand-500/50 rounded-2xl text-center focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
          >
            {/* Category image */}
            <div className="group-hover:shadow-brand-900/10 relative mb-3 aspect-square overflow-hidden rounded-2xl bg-neutral-100 transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                className={cn(
                  "object-cover",
                  "transition-transform duration-300 ease-out",
                  "group-hover:scale-105 motion-reduce:group-hover:scale-100",
                )}
              />
            </div>
            {/* Category name */}
            <p className="group-hover:text-brand-700 line-clamp-2 text-sm font-medium text-neutral-900 transition-colors">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

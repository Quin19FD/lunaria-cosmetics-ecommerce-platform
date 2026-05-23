import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Collection } from "@/modules/collections";

interface CollectionCardProps {
  collection: Collection;
  index: number;
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  const isReversed = index % 2 !== 0;

  return (
    <div
      className={cn(
        "grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12",
        isReversed && "lg:direction-rtl",
      )}
    >
      {/* Image */}
      <div className={cn("order-1", isReversed ? "lg:order-2" : "lg:order-1")}>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <Image
            src={collection.cardImage}
            alt={collection.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "order-2",
          isReversed ? "lg:order-1 lg:text-right" : "lg:order-2",
        )}
      >
        {/* Label */}
        <p className="text-xs font-semibold tracking-widest text-brand-500 uppercase">
          {collection.label}
        </p>

        {/* Heading */}
        <h2 className="mt-3 font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
          {collection.name}
        </h2>

        {/* Summary */}
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
          {collection.summary}
        </p>

        {/* CTA */}
        <Button asChild className="mt-6">
          <Link href={`/collections/${collection.slug}`}>
            {collection.ctaLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
}

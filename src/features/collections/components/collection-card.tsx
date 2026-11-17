import Image from "next/image";
import Link from "next/link";

import { Tilt3D, Tilt3DLayer, Tilt3DSheen } from "@/components/shared/tilt-3d";
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
      )}
    >
      {/* Image — a stack of tinted plates; on hover the stack fans out in depth */}
      <div className={cn("order-1", isReversed ? "lg:order-2" : "lg:order-1")}>
        <Tilt3D
          maxTilt={5}
          perspective={1400}
          activeScale={1}
          className="relative mx-auto w-full max-w-xl"
        >
          <Tilt3DLayer
            depth={-50}
            className={cn(
              "bg-brand-200/70 absolute inset-0 rounded-2xl",
              isReversed
                ? "-translate-x-3 translate-y-3 sm:-translate-x-4 sm:translate-y-4"
                : "translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4",
            )}
          />
          <Tilt3DLayer
            depth={-24}
            className={cn(
              "bg-brand-100 absolute inset-0 rounded-2xl",
              isReversed
                ? "-translate-x-1.5 translate-y-1.5 sm:-translate-x-2 sm:translate-y-2"
                : "translate-x-1.5 translate-y-1.5 sm:translate-x-2 sm:translate-y-2",
            )}
          />
          <Tilt3DLayer
            depth={24}
            className="shadow-brand-900/10 relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl"
          >
            <Image
              src={collection.cardImage}
              alt={collection.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <Tilt3DSheen intensity={0.25} />
          </Tilt3DLayer>
        </Tilt3D>
      </div>

      {/* Content */}
      <div
        className={cn(
          "order-2",
          isReversed ? "lg:order-1 lg:text-right" : "lg:order-2",
        )}
      >
        {/* Label */}
        <p className="text-brand-500 text-xs font-semibold tracking-widest uppercase">
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

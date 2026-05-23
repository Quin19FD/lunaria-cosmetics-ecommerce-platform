import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Collection } from "@/modules/collections";

interface CollectionHeroProps {
  collection: Collection;
}

export function CollectionHero({ collection }: CollectionHeroProps) {
  return (
    <section className="relative min-h-[480px] w-full overflow-hidden bg-neutral-900 lg:min-h-[540px]">
      {/* Background image */}
      <Image
        src={collection.heroImage}
        alt={collection.name}
        fill
        className="object-cover opacity-60"
        sizes="100vw"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          {/* Badge */}
          <span className="inline-block rounded-full bg-brand-500 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-white uppercase">
            {collection.badge}
          </span>

          {/* Headline */}
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {collection.headline}{" "}
            <span className="italic text-brand-300">
              {collection.highlightWord}
            </span>
          </h1>

          {/* Description */}
          <div className="mt-6 space-y-4">
            {collection.description.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-neutral-300 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA */}
          <Button asChild size="lg" className="mt-8">
            <Link href="#products">{collection.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface ProductImageGalleryProps {
  image: string;
  images: string[];
  name: string;
}

export function ProductImageGallery({
  image,
  images,
  name,
}: ProductImageGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : [image, image, image, image];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = galleryImages[selectedIndex];

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square max-h-[480px] w-full overflow-hidden rounded-2xl bg-brand-50">
        <Image
          src={selectedImage}
          alt={name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnail row */}
      <div className="mt-4 flex gap-3">
        {galleryImages.map((imgUrl, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors sm:h-20 sm:w-20",
              selectedIndex === index
                ? "border-brand-500"
                : "border-transparent hover:border-neutral-300",
            )}
            aria-label={`Xem ảnh ${index + 1}`}
          >
            <Image
              src={imgUrl}
              alt={`${name} ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";

import { Tilt3D, Tilt3DSheen } from "@/components/shared/tilt-3d";
import { cn } from "@/lib/utils";

export interface ProductImageGalleryProps {
  image: string;
  images: string[];
  name: string;
}

/**
 * Images turn like the faces of a carousel drum: the next image swings in on
 * rotateY from the side you are heading to. Under `prefers-reduced-motion`
 * the global MotionConfig drops the rotation and leaves a plain cross-fade.
 */
const turnVariants: Variants = {
  enter: (dir: number) => ({
    rotateY: dir * 65,
    x: `${dir * 18}%`,
    opacity: 0,
  }),
  center: { rotateY: 0, x: "0%", opacity: 1 },
  exit: (dir: number) => ({
    rotateY: dir * -65,
    x: `${dir * -18}%`,
    opacity: 0,
  }),
};

const TURN_TRANSITION = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function ProductImageGallery({
  image,
  images,
  name,
}: ProductImageGalleryProps) {
  const galleryImages = images.length > 0 ? images : [image];
  const hasThumbnails = galleryImages.length > 1;

  const [[selectedIndex, direction], setSelection] = useState<[number, number]>(
    [0, 0],
  );
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedImage = galleryImages[selectedIndex] ?? image;

  function select(index: number) {
    if (index === selectedIndex) return;
    setSelection([index, index > selectedIndex ? 1 : -1]);
  }

  // Arrow keys move between thumbnails (wrapping), Home/End jump.
  function handleThumbKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = galleryImages.length - 1;
    const keyMap: Record<string, number> = {
      ArrowRight: selectedIndex === last ? 0 : selectedIndex + 1,
      ArrowLeft: selectedIndex === 0 ? last : selectedIndex - 1,
      Home: 0,
      End: last,
    };
    const next = keyMap[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    thumbRefs.current[next]?.focus();
  }

  return (
    <div className="min-w-0">
      {/* Main image — tilts under the pointer, turns between images */}
      <Tilt3D maxTilt={6} perspective={1100} activeScale={1.01}>
        <div className="bg-brand-50 ring-brand-100 relative mx-auto aspect-square max-h-[480px] w-full overflow-hidden rounded-2xl ring-1 [perspective:1200px]">
          {/* Soft floor shadow gives the product something to stand on */}
          <div
            aria-hidden
            className="from-brand-200/60 absolute inset-x-[18%] bottom-[8%] h-[10%] rounded-[50%] bg-radial to-transparent blur-md"
          />
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={selectedImage + selectedIndex}
              custom={direction}
              variants={turnVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={TURN_TRANSITION}
              className="absolute inset-0 [backface-visibility:hidden]"
            >
              <Image
                src={selectedImage}
                alt={
                  hasThumbnails
                    ? `${name} — ảnh ${selectedIndex + 1}/${galleryImages.length}`
                    : name
                }
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={selectedIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
          <Tilt3DSheen intensity={0.28} />
        </div>
      </Tilt3D>

      {/* Thumbnail row — a single tab stop, arrows move within it */}
      {hasThumbnails && (
        <div
          role="group"
          aria-label="Ảnh sản phẩm"
          onKeyDown={handleThumbKeyDown}
          className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 py-1"
        >
          {galleryImages.map((imgUrl, index) => {
            const selected = selectedIndex === index;
            return (
              <button
                key={index}
                ref={(el) => {
                  thumbRefs.current[index] = el;
                }}
                type="button"
                onClick={() => select(index)}
                tabIndex={selected ? 0 : -1}
                aria-pressed={selected}
                aria-label={`Xem ảnh ${index + 1}`}
                className={cn(
                  "relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-[border-color,transform] duration-200 sm:h-20 sm:w-20",
                  "focus-visible:ring-brand-500/50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  selected
                    ? "border-brand-500 -translate-y-0.5 motion-reduce:translate-y-0"
                    : "border-transparent opacity-80 hover:border-neutral-300 hover:opacity-100",
                )}
              >
                <Image
                  src={imgUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

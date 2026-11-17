"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { normalizePointer } from "@/lib/tilt";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 90, damping: 20, mass: 0.8 };

interface SceneContextValue {
  allowMotion: boolean;
  /** Pointer position, -1..1 per axis (sprung). Stays 0 on touch. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** 0 while the scene sits at the top of the viewport → 1 once scrolled past. */
  scroll: MotionValue<number>;
}

const SceneContext = createContext<SceneContextValue | null>(null);

function useSceneContext(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx)
    throw new Error("<ParallaxLayer> must be used inside <ParallaxScene>");
  return ctx;
}

export interface ParallaxSceneProps {
  children: ReactNode;
  className?: string;
  /** CSS perspective for the layers, in px. */
  perspective?: number;
}

/**
 * A depth scene: <ParallaxLayer>s drift with the pointer and with scroll in
 * proportion to their `depth`, so near layers move more than far ones.
 *
 * - `prefers-reduced-motion`: everything is static.
 * - Coarse pointer (touch): pointer drift is off; gentle scroll drift stays.
 * Only transforms are animated, so layers never cause layout shift.
 */
export function ParallaxScene({
  children,
  className,
  perspective = 1200,
}: ParallaxSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { allowMotion, allowPointer } = useMotionPreference();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, SPRING);
  const pointerY = useSpring(rawY, SPRING);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!allowPointer || e.pointerType === "touch") return;
    const { x, y } = normalizePointer(
      e.clientX,
      e.clientY,
      e.currentTarget.getBoundingClientRect(),
    );
    rawX.set(x);
    rawY.set(y);
  }

  function handlePointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <SceneContext.Provider
      value={{ allowMotion, pointerX, pointerY, scroll: scrollYProgress }}
    >
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ perspective: `${perspective}px` }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {children}
      </div>
    </SceneContext.Provider>
  );
}

export interface ParallaxLayerProps {
  children?: ReactNode;
  className?: string;
  /**
   * Drift in px at full pointer deflection. Positive layers follow the
   * pointer (near), negative layers move against it (far).
   */
  depth: number;
  /** Extra rotation in degrees that follows the pointer (3D card feel). */
  tilt?: number;
  /** Vertical drift in px across one scene-height of scrolling. */
  scrollDepth?: number;
  "aria-hidden"?: boolean;
}

export function ParallaxLayer({
  children,
  className,
  depth,
  tilt = 0,
  scrollDepth = 0,
  "aria-hidden": ariaHidden,
}: ParallaxLayerProps) {
  const { allowMotion, pointerX, pointerY, scroll } = useSceneContext();

  const x = useTransform(pointerX, (v) => v * depth);
  const y = useTransform(
    [pointerY, scroll],
    ([py, s]: number[]) => py * depth + s * scrollDepth,
  );
  const rotateY = useTransform(pointerX, (v) => v * tilt);
  const rotateX = useTransform(pointerY, (v) => -v * tilt);

  if (!allowMotion) {
    return (
      <div className={className} aria-hidden={ariaHidden}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      aria-hidden={ariaHidden}
      style={{ x, y, rotateX, rotateY }}
    >
      {children}
    </motion.div>
  );
}

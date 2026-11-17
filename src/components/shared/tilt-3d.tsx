"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useRef,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { computeTilt, RESTING_TILT, type PointerBox } from "@/lib/tilt";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

interface TiltContextValue {
  enabled: boolean;
  /** 0 at rest → 1 while hovered/focused (sprung). */
  active: MotionValue<number>;
  /** Pointer position, 0–100 %. */
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
}

const TiltContext = createContext<TiltContextValue | null>(null);

function useTiltContext(component: string): TiltContextValue {
  const ctx = useContext(TiltContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tilt3D>`);
  return ctx;
}

export interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation per axis, in degrees. */
  maxTilt?: number;
  /** CSS perspective distance in px — lower is more dramatic. */
  perspective?: number;
  /** Scale while active. */
  activeScale?: number;
}

/**
 * Pointer-tracked 3D tilt. Children can lift off the surface with
 * <Tilt3DLayer depth> and catch light with <Tilt3DSheen>.
 *
 * Off (renders a plain div, no transforms) when the user prefers reduced
 * motion or the primary pointer is coarse (touch). Keyboard focus inside the
 * card lifts the layers without tilting, so focus gets the same depth cue.
 * Only `transform` and `opacity` are animated.
 */
export function Tilt3D({
  children,
  className,
  maxTilt = 8,
  perspective = 900,
  activeScale = 1.02,
}: Tilt3DProps) {
  const { allowPointer } = useMotionPreference();
  const boxRef = useRef<PointerBox | null>(null);

  const rotateXTarget = useMotionValue(0);
  const rotateYTarget = useMotionValue(0);
  const activeTarget = useMotionValue(0);
  const glareX = useMotionValue(RESTING_TILT.glareX);
  const glareY = useMotionValue(RESTING_TILT.glareY);

  const rotateX = useSpring(rotateXTarget, SPRING);
  const rotateY = useSpring(rotateYTarget, SPRING);
  const active = useSpring(activeTarget, SPRING);
  const scale = useTransform(active, [0, 1], [1, activeScale]);

  const ctx: TiltContextValue = {
    enabled: allowPointer,
    active,
    glareX,
    glareY,
  };

  if (!allowPointer) {
    return (
      <TiltContext.Provider value={ctx}>
        <div className={className}>{children}</div>
      </TiltContext.Provider>
    );
  }

  function reset() {
    boxRef.current = null;
    rotateXTarget.set(0);
    rotateYTarget.set(0);
    activeTarget.set(0);
    glareX.set(RESTING_TILT.glareX);
    glareY.set(RESTING_TILT.glareY);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    // Measure once per hover, not per frame.
    boxRef.current ??= e.currentTarget.getBoundingClientRect();
    const t = computeTilt(e.clientX, e.clientY, boxRef.current, maxTilt);
    rotateXTarget.set(t.rotateX);
    rotateYTarget.set(t.rotateY);
    glareX.set(t.glareX);
    glareY.set(t.glareY);
    activeTarget.set(1);
  }

  function handleFocus(e: FocusEvent<HTMLDivElement>) {
    if (e.target.matches(":focus-visible")) activeTarget.set(1);
  }

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) reset();
  }

  return (
    <TiltContext.Provider value={ctx}>
      <motion.div
        className={className}
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          rotateX,
          rotateY,
          scale,
          transformPerspective: perspective,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </TiltContext.Provider>
  );
}

export interface Tilt3DLayerProps {
  children?: ReactNode;
  className?: string;
  /** How far (px) the layer rises towards the viewer while active. */
  depth?: number;
}

/**
 * A layer that lifts off the tilting surface on translateZ while active.
 * Every element between <Tilt3D> and this layer needs
 * `transform-style: preserve-3d` and must not clip (`overflow: visible`).
 */
export function Tilt3DLayer({
  children,
  className,
  depth = 24,
}: Tilt3DLayerProps) {
  const { enabled, active } = useTiltContext("Tilt3DLayer");
  const z = useTransform(active, [0, 1], [0, depth]);

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} style={{ z }}>
      {children}
    </motion.div>
  );
}

export interface Tilt3DSheenProps {
  className?: string;
  /** Peak opacity of the highlight, 0–1. */
  intensity?: number;
}

/**
 * A soft specular highlight that slides opposite the pointer, like light on
 * a glossy bottle. Place inside a positioned, clipped element. Decorative.
 */
export function Tilt3DSheen({ className, intensity = 0.35 }: Tilt3DSheenProps) {
  const { enabled, active, glareX, glareY } = useTiltContext("Tilt3DSheen");
  // Highlight moves against the pointer, so it reads as a reflection.
  const x = useTransform(glareX, [0, 100], ["10%", "-10%"]);
  const y = useTransform(glareY, [0, 100], ["10%", "-10%"]);
  const opacity = useTransform(active, [0, 1], [0, intensity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -inset-1/2 z-[1]",
        "bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.9),rgb(255_255_255/0)_45%)]",
        className,
      )}
      style={{ x, y, opacity }}
    />
  );
}

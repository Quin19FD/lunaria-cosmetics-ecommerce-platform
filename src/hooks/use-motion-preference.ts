"use client";

import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(FINE_POINTER_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * True only on devices with a precise, hovering pointer (mouse/trackpad).
 * The server snapshot is `false`, so SSR markup never includes pointer
 * effects and touch devices never see them.
 */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER_QUERY).matches,
    () => false,
  );
}

/**
 * Whether decorative motion may run at all, and whether it may follow the
 * pointer. `prefers-reduced-motion: reduce` turns both off.
 */
export function useMotionPreference(): {
  allowMotion: boolean;
  allowPointer: boolean;
} {
  const reduced = useReducedMotion() ?? false;
  const fine = useFinePointer();
  return { allowMotion: !reduced, allowPointer: !reduced && fine };
}

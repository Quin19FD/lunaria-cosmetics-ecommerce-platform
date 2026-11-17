/**
 * Pure geometry for pointer-driven 3D effects (Tilt3D, ParallaxScene).
 * Kept framework-free so it can be unit tested in a node environment.
 */

export interface PointerBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface TiltState {
  /** Degrees around the X axis — positive pushes the top edge away. */
  rotateX: number;
  /** Degrees around the Y axis — positive pushes the right edge away. */
  rotateY: number;
  /** Pointer position inside the box, 0–100 (%), for the specular sheen. */
  glareX: number;
  glareY: number;
}

export const RESTING_TILT: TiltState = {
  rotateX: 0,
  rotateY: 0,
  glareX: 50,
  glareY: 50,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Pointer position mapped to -1..1 on each axis (0 = centre).
 * Positions outside the box are clamped; an empty box returns the centre.
 */
export function normalizePointer(
  clientX: number,
  clientY: number,
  box: PointerBox,
): { x: number; y: number } {
  if (box.width <= 0 || box.height <= 0) return { x: 0, y: 0 };
  const x = ((clientX - box.left) / box.width) * 2 - 1;
  const y = ((clientY - box.top) / box.height) * 2 - 1;
  return { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
}

/**
 * Tilt so the corner under the pointer is pressed in (recedes), like a
 * finger on a card. Capped at `maxTilt` degrees per axis.
 */
export function computeTilt(
  clientX: number,
  clientY: number,
  box: PointerBox,
  maxTilt: number,
): TiltState {
  const { x, y } = normalizePointer(clientX, clientY, box);
  const limit = Math.abs(maxTilt);
  return {
    // `+ 0` normalises -0 so results compare cleanly with ===.
    rotateX: -y * limit + 0,
    rotateY: x * limit + 0,
    glareX: ((x + 1) / 2) * 100,
    glareY: ((y + 1) / 2) * 100,
  };
}

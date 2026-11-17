import { describe, expect, it } from "vitest";

import { computeTilt, normalizePointer, RESTING_TILT } from "@/lib/tilt";

const box = { left: 100, top: 200, width: 200, height: 100 };

describe("normalizePointer", () => {
  it("maps the centre to 0,0 and corners to ±1", () => {
    expect(normalizePointer(200, 250, box)).toEqual({ x: 0, y: 0 });
    expect(normalizePointer(100, 200, box)).toEqual({ x: -1, y: -1 });
    expect(normalizePointer(300, 300, box)).toEqual({ x: 1, y: 1 });
  });

  it("clamps positions outside the box", () => {
    expect(normalizePointer(-500, 9999, box)).toEqual({ x: -1, y: 1 });
  });

  it("returns the centre for an empty box instead of NaN", () => {
    expect(
      normalizePointer(10, 10, { left: 0, top: 0, width: 0, height: 0 }),
    ).toEqual({ x: 0, y: 0 });
  });
});

describe("computeTilt", () => {
  it("rests flat with the glare centred when the pointer is centred", () => {
    expect(computeTilt(200, 250, box, 10)).toEqual(RESTING_TILT);
  });

  it("presses the hovered corner in, capped at maxTilt", () => {
    // Top-right corner: top edge and right edge both recede.
    const t = computeTilt(300, 200, box, 10);
    expect(t.rotateX).toBe(10);
    expect(t.rotateY).toBe(10);
    expect(t.glareX).toBe(100);
    expect(t.glareY).toBe(0);
  });

  it("treats a negative maxTilt as its magnitude", () => {
    expect(computeTilt(100, 300, box, -8)).toMatchObject({
      rotateX: -8,
      rotateY: -8,
    });
  });
});

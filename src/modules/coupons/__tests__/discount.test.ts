import { describe, expect, it } from "vitest";

import { computeDiscount } from "../discount";

describe("computeDiscount", () => {
  it("takes a percentage of the subtotal, rounded to whole VND", () => {
    expect(
      computeDiscount(
        { type: "PERCENT", value: 10, maxDiscount: null },
        333_335,
      ),
    ).toBe(33_334);
  });

  it("caps a percentage discount at maxDiscount", () => {
    expect(
      computeDiscount(
        { type: "PERCENT", value: 50, maxDiscount: 100_000 },
        1_000_000,
      ),
    ).toBe(100_000);
  });

  it("applies a fixed amount as is", () => {
    expect(
      computeDiscount(
        { type: "FIXED", value: 50_000, maxDiscount: null },
        400_000,
      ),
    ).toBe(50_000);
  });

  it("never discounts more than the subtotal", () => {
    expect(
      computeDiscount(
        { type: "FIXED", value: 50_000, maxDiscount: null },
        20_000,
      ),
    ).toBe(20_000);
    expect(
      computeDiscount(
        { type: "PERCENT", value: 150, maxDiscount: null },
        20_000,
      ),
    ).toBe(20_000);
  });
});

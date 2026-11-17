import { describe, expect, it } from "vitest";

import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  orderTotal,
  shippingFeeFor,
} from "../pricing";

describe("shippingFeeFor", () => {
  it("charges the flat fee below the threshold", () => {
    expect(shippingFeeFor(0)).toBe(SHIPPING_FEE);
    expect(shippingFeeFor(FREE_SHIPPING_THRESHOLD - 1)).toBe(SHIPPING_FEE);
  });

  it("is free from exactly the threshold upwards", () => {
    expect(shippingFeeFor(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(shippingFeeFor(2_000_000)).toBe(0);
  });
});

describe("orderTotal", () => {
  it("adds shipping and subtracts the discount", () => {
    expect(
      orderTotal({ subtotal: 320_000, shippingCost: 30_000, discount: 50_000 }),
    ).toBe(300_000);
  });

  it("never goes below zero", () => {
    expect(
      orderTotal({ subtotal: 10_000, shippingCost: 0, discount: 50_000 }),
    ).toBe(0);
  });
});

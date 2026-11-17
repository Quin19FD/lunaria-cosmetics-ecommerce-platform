import { describe, expect, it } from "vitest";

import { type CouponRules, couponIneligibility } from "../eligibility";

const now = new Date("2026-06-01T12:00:00Z");
const base: CouponRules = {
  active: true,
  expiresAt: null,
  usageLimit: null,
  usedCount: 0,
  minOrder: 0,
};

describe("couponIneligibility", () => {
  it("accepts an active, unlimited coupon", () => {
    expect(couponIneligibility(base, 100_000, now)).toBeNull();
  });

  it("rejects an inactive coupon", () => {
    expect(couponIneligibility({ ...base, active: false }, 100_000, now)).toBe(
      "inactive",
    );
  });

  it("rejects after expiry but accepts at the exact expiry instant", () => {
    const expired = { ...base, expiresAt: new Date(now.getTime() - 1) };
    expect(couponIneligibility(expired, 100_000, now)).toBe("expired");
    expect(
      couponIneligibility({ ...base, expiresAt: now }, 100_000, now),
    ).toBeNull();
  });

  it("rejects once every use is taken", () => {
    expect(
      couponIneligibility({ ...base, usageLimit: 3, usedCount: 3 }, 1, now),
    ).toBe("used_up");
    expect(
      couponIneligibility({ ...base, usageLimit: 3, usedCount: 2 }, 1, now),
    ).toBeNull();
  });

  it("enforces the minimum order, inclusive", () => {
    const coupon = { ...base, minOrder: 300_000 };
    expect(couponIneligibility(coupon, 299_999, now)).toBe("below_min_order");
    expect(couponIneligibility(coupon, 300_000, now)).toBeNull();
  });
});

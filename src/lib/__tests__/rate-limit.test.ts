import { describe, expect, it, vi } from "vitest";

// rate-limit.ts imports Prisma and next/headers; the pure helpers under test
// do not touch either, so stub them out.
vi.mock("@/lib/db", () => ({ prisma: {} }));
vi.mock("next/headers", () => ({ headers: vi.fn() }));

const { clientIpFrom, decide, rateLimitMessage } =
  await import("@/lib/rate-limit");

function headersOf(init: Record<string, string>) {
  return new Headers(init);
}

describe("clientIpFrom", () => {
  it("takes the first address from x-forwarded-for", () => {
    expect(
      clientIpFrom(headersOf({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" })),
    ).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip, then to 'unknown'", () => {
    expect(clientIpFrom(headersOf({ "x-real-ip": "198.51.100.2" }))).toBe(
      "198.51.100.2",
    );
    expect(clientIpFrom(headersOf({}))).toBe("unknown");
  });
});

describe("decide", () => {
  const now = new Date("2026-01-01T00:00:00Z");
  const in90s = new Date(now.getTime() + 90_000);

  it("allows hits up to and including the limit", () => {
    expect(decide(5, in90s, 5, now)).toEqual({ ok: true, retryAfterSec: 0 });
  });

  it("blocks the hit after the limit and reports seconds until reset", () => {
    expect(decide(6, in90s, 5, now)).toEqual({ ok: false, retryAfterSec: 90 });
  });

  it("allows again once the window has expired", () => {
    expect(decide(99, now, 5, now).ok).toBe(true);
  });
});

describe("rateLimitMessage", () => {
  it("rounds up to whole minutes, at least 1", () => {
    expect(rateLimitMessage(5)).toContain("1 phút");
    expect(rateLimitMessage(61)).toContain("2 phút");
  });
});

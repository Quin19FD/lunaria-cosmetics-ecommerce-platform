import { headers } from "next/headers";

import { prisma } from "@/lib/db";

/**
 * Fixed-window rate limiting backed by Postgres (`rate_limits` table), so the
 * limit holds across serverless instances without extra infrastructure.
 */

export interface RateLimitRule {
  /** Namespace for the counter key. */
  name: string;
  /** Max hits allowed per window. */
  limit: number;
  windowMs: number;
}

export interface RateLimitDecision {
  ok: boolean;
  /** Seconds until the window resets; 0 when allowed. */
  retryAfterSec: number;
}

const MINUTE = 60_000;

export const RATE_LIMITS = {
  /** Failed logins per IP + email (brute force on one account). */
  loginFailures: { name: "login-fail", limit: 5, windowMs: 15 * MINUTE },
  /** Failed logins per IP (credential stuffing across accounts). */
  loginFailuresIp: { name: "login-fail-ip", limit: 20, windowMs: 15 * MINUTE },
  register: { name: "register", limit: 5, windowMs: 60 * MINUTE },
  forgotPasswordEmail: { name: "forgot", limit: 3, windowMs: 15 * MINUTE },
  forgotPasswordIp: { name: "forgot-ip", limit: 10, windowMs: 60 * MINUTE },
  coupon: { name: "coupon", limit: 30, windowMs: 10 * MINUTE },
} as const satisfies Record<string, RateLimitRule>;

/** Purge old rows on roughly 1% of writes to keep the table small. */
const CLEANUP_PROBABILITY = 0.01;
const CLEANUP_AGE_MS = 24 * 60 * MINUTE;

/**
 * Client IP from proxy headers. On Vercel `x-forwarded-for` is set by the
 * platform; when self-hosting, run behind a proxy that overwrites it.
 */
export function clientIpFrom(h: Pick<Headers, "get">): string {
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return h.get("x-real-ip")?.trim() || "unknown";
}

export async function requestIp(): Promise<string> {
  return clientIpFrom(await headers());
}

/** Pure decision for a counter state; exported for unit tests. */
export function decide(
  count: number,
  resetAt: Date,
  limit: number,
  now: Date,
): RateLimitDecision {
  if (count <= limit || resetAt <= now) return { ok: true, retryAfterSec: 0 };
  return {
    ok: false,
    retryAfterSec: Math.max(
      1,
      Math.ceil((resetAt.getTime() - now.getTime()) / 1000),
    ),
  };
}

function keyOf(rule: RateLimitRule, identifier: string): string {
  return `${rule.name}:${identifier.toLowerCase()}`;
}

/** Records one hit and returns the counter after it (atomic upsert). */
async function hit(
  rule: RateLimitRule,
  identifier: string,
  now: Date,
): Promise<{ count: number; resetAt: Date }> {
  const key = keyOf(rule, identifier);
  const freshReset = new Date(now.getTime() + rule.windowMs);
  const rows = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
    INSERT INTO "rate_limits" ("key", "count", "resetAt")
    VALUES (${key}, 1, ${freshReset})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "rate_limits"."resetAt" <= ${now}
                     THEN 1 ELSE "rate_limits"."count" + 1 END,
      "resetAt" = CASE WHEN "rate_limits"."resetAt" <= ${now}
                       THEN EXCLUDED."resetAt" ELSE "rate_limits"."resetAt" END
    RETURNING "count", "resetAt"`;

  if (Math.random() < CLEANUP_PROBABILITY) {
    await prisma.rateLimit.deleteMany({
      where: { resetAt: { lt: new Date(now.getTime() - CLEANUP_AGE_MS) } },
    });
  }
  return rows[0];
}

/**
 * Counts this request against every rule and reports the first one exceeded.
 * Use for actions where every attempt counts (register, password reset, …).
 */
export async function consumeRateLimit(
  checks: ReadonlyArray<readonly [RateLimitRule, string]>,
): Promise<RateLimitDecision> {
  const now = new Date();
  let result: RateLimitDecision = { ok: true, retryAfterSec: 0 };
  for (const [rule, id] of checks) {
    const { count, resetAt } = await hit(rule, id, now);
    const decision = decide(count, resetAt, rule.limit, now);
    if (!decision.ok && result.ok) result = decision;
  }
  return result;
}

/**
 * Read-only check: true when any counter is already at its limit. Pair with
 * {@link recordRateLimitHit} to count only failures (e.g. wrong passwords).
 */
export async function isRateLimited(
  checks: ReadonlyArray<readonly [RateLimitRule, string]>,
): Promise<boolean> {
  const now = new Date();
  const rows = await prisma.rateLimit.findMany({
    where: { key: { in: checks.map(([rule, id]) => keyOf(rule, id)) } },
  });
  return rows.some((row) => {
    const rule = checks.find(([r, id]) => keyOf(r, id) === row.key)?.[0];
    return !!rule && !decide(row.count + 1, row.resetAt, rule.limit, now).ok;
  });
}

export async function recordRateLimitHit(
  checks: ReadonlyArray<readonly [RateLimitRule, string]>,
): Promise<void> {
  const now = new Date();
  for (const [rule, id] of checks) await hit(rule, id, now);
}

export function rateLimitMessage(retryAfterSec: number): string {
  const minutes = Math.max(1, Math.ceil(retryAfterSec / 60));
  return `Bạn thao tác quá nhiều lần. Vui lòng thử lại sau ${minutes} phút.`;
}

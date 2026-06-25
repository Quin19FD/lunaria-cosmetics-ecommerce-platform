import Stripe from "stripe";

/**
 * Server-side Stripe client. When the secret key is absent (dev default) we
 * construct with a harmless placeholder so importing this module never throws —
 * `new Stripe("")` would otherwise crash at import. Real API calls are gated by
 * `isStripeConfigured`; webhook signature verification uses the webhook secret,
 * not this key, so it works regardless of the placeholder.
 */
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_unconfigured_placeholder",
);

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

/**
 * Prices across this store are integer Vietnamese đồng. VND is a zero-decimal
 * Stripe currency, so the amount sent to Stripe is the đồng value verbatim — it
 * must NOT be multiplied by 100.
 */
export const STRIPE_CURRENCY = "vnd";

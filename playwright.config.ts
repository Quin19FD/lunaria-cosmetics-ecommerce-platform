import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config. The web server is the production build (`next start`) so the suite
 * exercises real routes. Runs on port 3100 to avoid colliding with a dev server
 * on 3000. STRIPE_WEBHOOK_SECRET is injected so the Stripe webhook spec can post
 * a locally-signed event (the spec signs with the same secret). Postgres must be
 * running (docker compose up -d db) and seeded.
 */
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
export const E2E_WEBHOOK_SECRET = "whsec_e2e_test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      STRIPE_WEBHOOK_SECRET: E2E_WEBHOOK_SECRET,
      AUTH_URL: BASE_URL,
      NEXT_PUBLIC_APP_URL: BASE_URL,
    },
  },
});

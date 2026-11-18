import { defineConfig, devices } from "@playwright/test";

/**
 * Visual check: opens the storefront in three browsers, asserts the 3D effects
 * behave as designed (on for a mouse, off for touch), checks for horizontal
 * overflow and broken images, and saves screenshots to `visual-shots/` for a
 * human to review. Not part of `pnpm test:e2e`; run with `pnpm test:visual`
 * against a production build and a seeded database.
 */
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./visual",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: { baseURL: BASE_URL },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "webkit-desktop",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-mobile-360",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 360, height: 740 },
      },
    },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: { AUTH_URL: BASE_URL, NEXT_PUBLIC_APP_URL: BASE_URL },
  },
});

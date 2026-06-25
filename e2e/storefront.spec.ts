import { test, expect } from "@playwright/test";

test("home page renders header navigation", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBeLessThan(400);
  await expect(
    page.getByRole("link", { name: "Sản phẩm" }).first(),
  ).toBeVisible();
});

test("products page lists product cards", async ({ page }) => {
  await page.goto("/products");
  // Products are fetched client-side; wait for at least one detail link.
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible({
    timeout: 20_000,
  });
});

test("promotions page shows a seeded promotion code (DB-backed)", async ({
  page,
}) => {
  await page.goto("/promotions");
  await expect(page.getByText("SUMMER40").first()).toBeVisible({
    timeout: 20_000,
  });
});

test("collections page shows a seeded collection (DB-backed)", async ({
  page,
}) => {
  await page.goto("/collections");
  await expect(page.getByText("Hào Quang Mùa Xuân").first()).toBeVisible({
    timeout: 20_000,
  });
});

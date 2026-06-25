import { test, expect } from "@playwright/test";

test("user can log in with seeded credentials", async ({ page }) => {
  await page.goto("/auth/login");
  await page.fill("#login-email", "demo@lunaria.beauty");
  await page.fill("#login-password", "123456");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });
});

test("login surfaces an error on bad credentials", async ({ page }) => {
  await page.goto("/auth/login");
  await page.fill("#login-email", "demo@lunaria.beauty");
  await page.fill("#login-password", "definitely-wrong");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Email hoặc mật khẩu không đúng")).toBeVisible();
});

test("forgot-password issues a reset and shows the sent state", async ({
  page,
}) => {
  await page.goto("/auth/forgot-password");
  await page.fill("#forgot-email", "demo@lunaria.beauty");
  await page.getByRole("button", { name: "Send Reset Link" }).click();
  await expect(page.getByText("Email Sent")).toBeVisible({ timeout: 15_000 });
});

test("reset-password with no token shows an invalid-link path back", async ({
  page,
}) => {
  await page.goto("/auth/reset-password");
  await expect(
    page.locator('a[href="/auth/forgot-password"]').first(),
  ).toBeVisible();
});

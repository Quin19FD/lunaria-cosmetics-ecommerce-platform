import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test.afterAll(async () => {
  await prisma.$disconnect();
});

test.beforeEach(async ({ page }) => {
  await page.goto("/auth/login");
  await page.fill("#login-email", "admin@lunaria.beauty");
  await page.fill("#login-password", "admin123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });
});

test("coupons admin lists seeded coupons", async ({ page }) => {
  await page.goto("/admin/coupons");
  await expect(page.getByText("SALE10")).toBeVisible();
  await expect(page.getByText("GIAM50K")).toBeVisible();
});

test("promotions admin lists a seeded promotion", async ({ page }) => {
  await page.goto("/admin/promotions");
  await expect(page.getByText("SUMMER40")).toBeVisible();
});

test("collections admin lists a seeded collection", async ({ page }) => {
  await page.goto("/admin/collections");
  await expect(page.getByText("lunaria-bloom")).toBeVisible();
});

test("admin can create a coupon and it appears in the list", async ({
  page,
}) => {
  const code = `E2E${Date.now().toString().slice(-7)}`;
  try {
    await page.goto("/admin/coupons");
    await page.fill("#code", code);
    await page.fill("#value", "15");
    await page.getByRole("button", { name: "Thêm mã" }).click();
    await page.waitForURL("**/admin/coupons", { timeout: 15_000 });
    await expect(page.getByText(code)).toBeVisible({ timeout: 15_000 });
    const row = await prisma.coupon.findUnique({ where: { code } });
    expect(row?.value).toBe(15);
  } finally {
    await prisma.coupon.deleteMany({ where: { code } });
  }
});

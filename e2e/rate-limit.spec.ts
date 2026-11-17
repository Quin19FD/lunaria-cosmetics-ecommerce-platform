import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Not a seeded account: only the per IP+email counter reaches its limit, so
// other specs logging in from the same IP are unaffected.
const EMAIL = "rate-limit-probe@example.com";

async function clearCounters() {
  await prisma.rateLimit.deleteMany({
    where: { key: { contains: EMAIL } },
  });
}

test.beforeAll(clearCounters);
test.afterAll(async () => {
  await clearCounters();
  // Undo this spec's hits on the shared per-IP failure counter too.
  await prisma.rateLimit.deleteMany({
    where: { key: { startsWith: "login-fail-ip:" } },
  });
  await prisma.$disconnect();
});

test("login locks out after 5 failed attempts for one email", async ({
  page,
}) => {
  await page.goto("/auth/login");
  for (let i = 0; i < 5; i++) {
    await page.fill("#login-email", EMAIL);
    await page.fill("#login-password", `wrong-${i}`);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(
      page.getByText("Email hoặc mật khẩu không đúng"),
    ).toBeVisible();
  }

  await page.fill("#login-password", "wrong-again");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("đăng nhập sai quá nhiều lần")).toBeVisible();
});

import {
  test,
  expect,
  type APIResponse,
  type Browser,
  type BrowserContext,
  type Page,
} from "@playwright/test";
import { PrismaClient, type UserRole } from "@prisma/client";

/**
 * Server Actions are public POST endpoints: the admin layout guard only stops
 * rendering, not invocation. These specs replay the exact role-change form
 * submission an admin page produces, from sessions that must NOT be allowed to
 * run it, and assert the database is unchanged.
 */

const prisma = new PrismaClient();

const SUPER_ADMIN = { email: "admin@lunaria.beauty", password: "admin123" };
const CUSTOMER = { email: "demo@lunaria.beauty", password: "123456" };
const PROMOTED = { email: "baoq@example.com", password: "123456" };
const TARGET_EMAIL = "thuha@example.com";

type FormFields = [string, string][];

async function login(page: Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.fill("#login-email", email);
  await page.fill("#login-password", password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });
}

/**
 * Logs in as SUPER_ADMIN and reads the server-rendered role form for one user.
 * JavaScript is disabled on the reading context so React's progressive
 * enhancement fields ($ACTION_*) stay in the DOM exactly as served.
 */
async function captureRoleForm(
  browser: Browser,
  targetEmail: string,
): Promise<FormFields> {
  const loginCtx = await browser.newContext();
  await login(
    await loginCtx.newPage(),
    SUPER_ADMIN.email,
    SUPER_ADMIN.password,
  );
  const storageState = await loginCtx.storageState();
  await loginCtx.close();

  const ctx = await browser.newContext({
    javaScriptEnabled: false,
    storageState,
  });
  try {
    const page = await ctx.newPage();
    await page.goto(`/admin/users?q=${encodeURIComponent(targetEmail)}`);
    const form = page
      .locator("tr", { hasText: targetEmail })
      .locator('form:has(input[name^="$ACTION"])');
    await expect(form).toHaveCount(1);
    const fields = await form.evaluate((el) =>
      Array.from(new FormData(el as HTMLFormElement).entries()).map(
        ([k, v]) => [k, String(v)] as [string, string],
      ),
    );
    // Fail loudly if Next changes its no-JS action encoding.
    expect(fields.some(([k]) => k.startsWith("$ACTION_REF"))).toBe(true);
    return fields;
  } finally {
    await ctx.close();
  }
}

async function submitRoleForm(
  ctx: BrowserContext,
  fields: FormFields,
  role: UserRole,
) {
  const multipart: Record<string, string> = {};
  for (const [k, v] of fields) multipart[k] = k === "role" ? role : v;
  const baseURL = test.info().project.use.baseURL ?? "";
  return ctx.request.post("/admin/users", {
    multipart,
    headers: { Origin: baseURL },
    maxRedirects: 0,
    failOnStatusCode: false,
  });
}

/** The action redirected (rejected by the guard) to `path`. */
function expectRedirectTo(res: APIResponse, path: string) {
  expect(res.status()).toBeGreaterThanOrEqual(300);
  expect(res.status()).toBeLessThan(400);
  const location = res.headers()["location"] ?? "";
  expect(new URL(location, "http://x").pathname).toBe(path);
}

async function roleOf(email: string): Promise<UserRole | undefined> {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.role;
}

async function resetRoles() {
  await prisma.user.updateMany({
    where: { email: { in: [CUSTOMER.email, PROMOTED.email, TARGET_EMAIL] } },
    data: { role: "CUSTOMER" },
  });
}

test.beforeEach(resetRoles);

test.afterAll(async () => {
  await resetRoles();
  await prisma.$disconnect();
});

test("SUPER_ADMIN replaying the role form succeeds (control)", async ({
  browser,
}) => {
  const fields = await captureRoleForm(browser, TARGET_EMAIL);
  const ctx = await browser.newContext();
  try {
    await login(await ctx.newPage(), SUPER_ADMIN.email, SUPER_ADMIN.password);
    const res = await submitRoleForm(ctx, fields, "ADMIN");
    expect(res.status()).toBe(200);
    expect(await roleOf(TARGET_EMAIL)).toBe("ADMIN");
  } finally {
    await ctx.close();
  }
});

test("CUSTOMER cannot call updateUserRole to escalate themselves", async ({
  browser,
}) => {
  const fields = await captureRoleForm(browser, CUSTOMER.email);
  const ctx = await browser.newContext();
  try {
    await login(await ctx.newPage(), CUSTOMER.email, CUSTOMER.password);
    const res = await submitRoleForm(ctx, fields, "SUPER_ADMIN");
    expectRedirectTo(res, "/");
    expect(await roleOf(CUSTOMER.email)).toBe("CUSTOMER");
  } finally {
    await ctx.close();
  }
});

test("ADMIN (not SUPER_ADMIN) cannot change roles", async ({ browser }) => {
  const fields = await captureRoleForm(browser, TARGET_EMAIL);
  await prisma.user.update({
    where: { email: PROMOTED.email },
    data: { role: "ADMIN" },
  });
  const ctx = await browser.newContext();
  try {
    await login(await ctx.newPage(), PROMOTED.email, PROMOTED.password);
    const res = await submitRoleForm(ctx, fields, "SUPER_ADMIN");
    expectRedirectTo(res, "/admin");
    expect(await roleOf(TARGET_EMAIL)).toBe("CUSTOMER");
  } finally {
    await ctx.close();
  }
});

test("SUPER_ADMIN gets no role form on their own row", async ({ page }) => {
  await login(page, SUPER_ADMIN.email, SUPER_ADMIN.password);
  await page.goto(`/admin/users?q=${encodeURIComponent(SUPER_ADMIN.email)}`);
  await expect(page.locator("main").getByText(SUPER_ADMIN.email)).toBeVisible();
  await expect(page.getByRole("button", { name: "Lưu" })).toHaveCount(0);
});

test("demoted ADMIN loses access even with an old ADMIN session token", async ({
  page,
}) => {
  await prisma.user.update({
    where: { email: PROMOTED.email },
    data: { role: "ADMIN" },
  });
  await login(page, PROMOTED.email, PROMOTED.password);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin$/);

  // JWT still says ADMIN; the database no longer does.
  await prisma.user.update({
    where: { email: PROMOTED.email },
    data: { role: "CUSTOMER" },
  });
  await page.goto("/admin");
  await page.waitForURL((url) => url.pathname === "/");
});

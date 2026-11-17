import { mkdirSync } from "node:fs";
import path from "node:path";

import {
  test,
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";

const SHOTS_ROOT = path.join(process.cwd(), "visual-shots");
const PRODUCT_CARD = '[class*="group/card"]';
const PRODUCT_LINK = 'a[href^="/products/"]';

function isTouch(info: TestInfo): boolean {
  return info.project.name.includes("mobile");
}

async function shot(
  page: Page,
  info: TestInfo,
  name: string,
  fullPage = false,
): Promise<void> {
  const dir = path.join(SHOTS_ROOT, info.project.name);
  mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage });
}

/** Scroll through the page so lazy images load and in-view animations run. */
async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
  });
  await page
    .waitForFunction(
      () => Array.from(document.images).every((img) => img.complete),
      undefined,
      { timeout: 20_000 },
    )
    .catch(() => undefined); // reported by expectHealthy as still-loading
  await page.waitForTimeout(600);
}

/** No sideways scroll, and every image that finished loading has pixels. */
async function expectHealthy(page: Page): Promise<void> {
  const report = await page.evaluate(() => ({
    overflow:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
    broken: Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
  }));
  expect(report.overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);
  expect(report.broken, "images that did not load").toEqual([]);
}

async function transformOf(target: Locator): Promise<string> {
  return target.evaluate((el) => getComputedStyle(el).transform);
}

/** Move a real pointer across the element, ending off-centre. */
async function hoverOffCentre(page: Page, target: Locator): Promise<void> {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  if (!box) throw new Error("element has no box");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.25, {
    steps: 12,
  });
  await page.waitForTimeout(700); // spring settles
}

let consoleErrors: string[] = [];

test.beforeEach(({ page }) => {
  consoleErrors = [];
  page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
});

test.afterEach(() => {
  expect(consoleErrors, "browser console errors").toEqual([]);
});

test("home: hero parallax and full page", async ({ page }, info) => {
  await page.goto("/");
  await settle(page);
  await shot(page, info, "01-home-top");

  const scene = page.locator(".aspect-square.max-w-md").first();
  if (!isTouch(info) && (await scene.isVisible())) {
    await hoverOffCentre(page, scene);
    await shot(page, info, "02-home-hero-pointer");
    await page.mouse.move(0, 0);
  }

  await expectHealthy(page);
  await shot(page, info, "03-home-full", true);
});

test("products: card tilt follows a mouse and is off for touch", async ({
  page,
}, info) => {
  await page.goto("/products");
  await expect(page.locator(PRODUCT_LINK).first()).toBeVisible({
    timeout: 20_000,
  });
  await settle(page);
  await shot(page, info, "04-products-full", true);

  const card = page.locator(PRODUCT_CARD).first();
  await expect(card).toBeVisible();
  expect(await transformOf(card), "card at rest").toBe("none");

  if (isTouch(info)) {
    await card.scrollIntoViewIfNeeded();
    await card.dispatchEvent("pointermove", { pointerType: "touch" });
    expect(await transformOf(card), "touch must not tilt").toBe("none");
  } else {
    await hoverOffCentre(page, card);
    expect(await transformOf(card), "hovered card").toContain("matrix3d");
    await shot(page, info, "05-products-card-hover");
    await page.mouse.move(0, 0);
    await page.waitForTimeout(700);
    expect(await transformOf(card), "card after leave").toBe("none");
  }

  await expectHealthy(page);
});

test("products: mobile filter drawer", async ({ page }, info) => {
  test.skip(!isTouch(info), "drawer exists below lg only");
  await page.goto("/products");
  await expect(page.locator(PRODUCT_LINK).first()).toBeVisible({
    timeout: 20_000,
  });
  await page
    .getByRole("button", { name: /Bộ lọc/ })
    .first()
    .click();
  const drawer = page.getByRole("dialog", { name: "Bộ lọc" });
  await expect(drawer).toBeVisible();
  await shot(page, info, "06-products-filter-drawer");
  await page.getByRole("button", { name: "Đóng bộ lọc" }).click();
  await expect(drawer).toBeHidden();
});

test("product detail: gallery", async ({ page }, info) => {
  await page.goto("/products");
  const first = page.locator(PRODUCT_LINK).first();
  await expect(first).toBeVisible({ timeout: 20_000 });
  const href = await first.getAttribute("href");
  await page.goto(href ?? "/products");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await settle(page);
  await shot(page, info, "07-product-detail-top");

  const secondThumb = page.getByRole("button", { name: "Xem ảnh 2" });
  if (await secondThumb.isVisible()) {
    await secondThumb.click();
    await page.waitForTimeout(600);
    await shot(page, info, "08-product-detail-image-2");
  }

  await expectHealthy(page);
  await shot(page, info, "09-product-detail-full", true);
});

test("collections: stacked plates", async ({ page }, info) => {
  await page.goto("/collections");
  await expect(page.getByText("Hào Quang Mùa Xuân").first()).toBeVisible({
    timeout: 20_000,
  });
  await settle(page);

  if (!isTouch(info)) {
    const plate = page.locator(".max-w-xl").first();
    await hoverOffCentre(page, plate);
    await shot(page, info, "10-collections-hover");
    await page.mouse.move(0, 0);
  }

  await expectHealthy(page);
  await shot(page, info, "11-collections-full", true);
});

for (const [name, url] of [
  ["12-cart", "/cart"],
  ["13-login", "/auth/login"],
  ["14-register", "/auth/register"],
  ["15-promotions", "/promotions"],
] as const) {
  test(`static page ${url}`, async ({ page }, info) => {
    await page.goto(url);
    await settle(page);
    await expectHealthy(page);
    await shot(page, info, name, true);
  });
}

test("reduced motion turns the tilt off", async ({ page }, info) => {
  test.skip(isTouch(info), "pointer effects are already off for touch");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products");
  const card = page.locator(PRODUCT_CARD).first();
  await expect(card).toBeVisible({ timeout: 20_000 });
  await hoverOffCentre(page, card);
  expect(await transformOf(card), "reduced motion").toBe("none");
});

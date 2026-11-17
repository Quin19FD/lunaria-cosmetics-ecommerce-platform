import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
test.afterAll(() => prisma.$disconnect());

test("robots.txt blocks private areas and points to the sitemap", async ({
  request,
}) => {
  const res = await request.get("/robots.txt");
  expect(res.ok()).toBe(true);
  const body = await res.text();
  expect(body).toContain("Disallow: /admin");
  expect(body).toMatch(/Sitemap: .*\/sitemap\.xml/);
});

test("sitemap lists active products", async ({ request }) => {
  const product = await prisma.product.findFirstOrThrow({
    where: { isActive: true },
  });
  const res = await request.get("/sitemap.xml");
  expect(res.ok()).toBe(true);
  expect(await res.text()).toContain(`/products/${product.slug}</loc>`);
});

test("product page has Product JSON-LD and Open Graph tags", async ({
  page,
}) => {
  const product = await prisma.product.findFirstOrThrow({
    where: { isActive: true },
  });
  await page.goto(`/products/${product.slug}`);

  const raw = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  const ld = JSON.parse(raw ?? "{}");
  expect(ld["@type"]).toBe("Product");
  expect(ld.name).toBe(product.name);
  expect(ld.offers.priceCurrency).toBe("VND");

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /^https?:\/\//,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    new RegExp(`/products/${product.slug}$`),
  );
});

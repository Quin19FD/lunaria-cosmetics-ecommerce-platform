import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/constants";
import { prisma } from "@/lib/db";

// Rebuilt at most hourly so new products show up without a redeploy.
export const revalidate = 3600;

const STATIC_PATHS = [
  "/",
  "/products",
  "/collections",
  "/promotions",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, SITE_CONFIG.url).toString();
  const [products, collections] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.collection.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  return [
    ...STATIC_PATHS.map((path) => ({
      url: url(path),
      changeFrequency: "daily" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: url(`/products/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...collections.map((c) => ({
      url: url(`/collections/${c.slug}`),
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}

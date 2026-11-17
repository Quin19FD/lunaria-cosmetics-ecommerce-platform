import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private or per-user pages: nothing useful to index.
      disallow: ["/admin", "/account", "/auth", "/cart", "/checkout", "/api"],
    },
    sitemap: new URL("/sitemap.xml", SITE_CONFIG.url).toString(),
  };
}

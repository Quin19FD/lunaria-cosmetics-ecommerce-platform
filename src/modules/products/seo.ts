import type { Product } from "./types";

export interface ReviewRating {
  rating: number;
}

/** Absolute URL for an image path; leaves absolute URLs untouched. */
export function absoluteUrl(pathOrUrl: string, siteUrl: string): string {
  return new URL(pathOrUrl, siteUrl).toString();
}

/**
 * schema.org Product for a product page. Ratings come from the visible
 * reviews actually stored, not from display counters, and are omitted when
 * there are none.
 */
export function productJsonLd(
  product: Product,
  reviews: readonly ReviewRating[],
  siteUrl: string,
): Record<string, unknown> {
  const prices = product.variants.length
    ? product.variants.map((v) => v.salePrice ?? v.price)
    : [product.salePrice ?? product.price];
  const inStock = product.variants.length
    ? product.variants.some((v) => v.stock > 0)
    : true;
  const url = absoluteUrl(`/products/${product.slug}`, siteUrl);

  const images = [product.image, ...product.images]
    .filter((src, i, all) => src && all.indexOf(src) === i)
    .map((src) => absoluteUrl(src, siteUrl));

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images,
    url,
    category: product.category,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url,
    },
  };

  if (reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return jsonLd;
}

/**
 * Serialises JSON-LD for a <script> tag. Escapes `<` so a value containing
 * "</script>" cannot close the tag early.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

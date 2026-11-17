import { describe, expect, it } from "vitest";

import { productJsonLd, serializeJsonLd } from "../seo";
import type { Product } from "../types";

const SITE = "https://shop.example";

const product: Product = {
  id: "p1",
  name: "Velvet Rose",
  slug: "velvet-rose",
  description: "Matte lipstick",
  image: "/images/velvet.jpg",
  images: ["/images/velvet.jpg", "https://cdn.example/velvet-2.jpg"],
  category: "Son môi",
  categorySlug: "son-moi",
  brand: "Lunaria",
  price: 320_000,
  rating: 4.9,
  reviewCount: 890,
  skinTypes: [],
  isActive: true,
  variants: [
    { id: "v1", name: "Rose", price: 320_000, stock: 0 },
    { id: "v2", name: "Plum", price: 350_000, salePrice: 299_000, stock: 4 },
  ],
  defaultVariantId: "v1",
};

describe("productJsonLd", () => {
  it("builds an AggregateOffer from variant prices and stock", () => {
    const ld = productJsonLd(product, [], SITE);
    expect(ld.offers).toMatchObject({
      priceCurrency: "VND",
      lowPrice: 299_000,
      highPrice: 320_000,
      offerCount: 2,
      availability: "https://schema.org/InStock",
      url: "https://shop.example/products/velvet-rose",
    });
  });

  it("makes image URLs absolute and de-duplicates them", () => {
    expect(productJsonLd(product, [], SITE).image).toEqual([
      "https://shop.example/images/velvet.jpg",
      "https://cdn.example/velvet-2.jpg",
    ]);
  });

  it("is out of stock when no variant has stock", () => {
    const soldOut = {
      ...product,
      variants: product.variants.map((v) => ({ ...v, stock: 0 })),
    };
    expect(productJsonLd(soldOut, [], SITE).offers).toMatchObject({
      availability: "https://schema.org/OutOfStock",
    });
  });

  it("rates from stored reviews, ignoring the display counters", () => {
    const ld = productJsonLd(product, [{ rating: 5 }, { rating: 4 }], SITE);
    expect(ld.aggregateRating).toMatchObject({
      ratingValue: 4.5,
      reviewCount: 2,
    });
    expect(productJsonLd(product, [], SITE).aggregateRating).toBeUndefined();
  });
});

describe("serializeJsonLd", () => {
  it("cannot break out of the script tag", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)).toEqual({ name: "</script><script>alert(1)" });
  });
});

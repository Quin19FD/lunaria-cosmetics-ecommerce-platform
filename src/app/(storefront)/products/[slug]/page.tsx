import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ProductImageGallery,
  ProductInfo,
  ProductTabs,
  RelatedProducts,
} from "@/features/product-detail";
import { SITE_CONFIG } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { productService } from "@/modules/products";
import { getProductReviews } from "@/modules/products/review.actions";
import {
  absoluteUrl,
  productJsonLd,
  serializeJsonLd,
} from "@/modules/products/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) return { title: "Sản phẩm không tìm thấy" };

  const path = `/products/${product.slug}`;
  const description = product.description.slice(0, 160);
  const image = absoluteUrl(product.image, SITE_CONFIG.url);
  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: product.name,
      description,
      url: path,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export async function generateStaticParams() {
  const products = await productService.getAll();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) notFound();

  const [related, reviews, details] = await Promise.all([
    productService.getRelated(product, 4),
    getProductReviews(product.id),
    prisma.product.findUnique({
      where: { slug },
      select: { ingredients: true, howToUse: true },
    }),
  ]);

  const jsonLd = productJsonLd(product, reviews, SITE_CONFIG.url);

  return (
    <>
      <script
        type="application/ld+json"
        // serializeJsonLd escapes "<", so stored text cannot close the tag.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImageGallery
            image={product.image}
            images={product.images}
            name={product.name}
          />
          <ProductInfo product={product} />
        </div>

        <div className="mt-12">
          <ProductTabs
            description={product.description}
            ingredients={details?.ingredients}
            howToUse={details?.howToUse}
            reviews={reviews}
            productId={product.id}
            slug={product.slug}
          />
        </div>
      </div>

      {related.length > 0 && <RelatedProducts products={related} />}
    </>
  );
}

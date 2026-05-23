import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ProductImageGallery,
  ProductInfo,
  ProductTabs,
  RelatedProducts,
} from "@/features/product-detail";
import { productService } from "@/modules/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = productService.getBySlug(slug);
  if (!product) return { title: "Sản phẩm không tìm thấy" };

  return {
    title: product.name,
    description: product.description,
  };
}

export function generateStaticParams() {
  return productService.getAll().map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = productService.getBySlug(slug);
  if (!product) notFound();

  const related = productService.getRelated(product, 4);

  return (
    <>
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
            reviewCount={product.reviewCount}
          />
        </div>
      </div>

      {related.length > 0 && <RelatedProducts products={related} />}
    </>
  );
}

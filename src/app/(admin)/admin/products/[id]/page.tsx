import { notFound } from "next/navigation";

import { PageHeader } from "@/features/admin";
import { prisma } from "@/lib/db";

import {
  createImage,
  createVariant,
  deleteImage,
  deleteVariant,
  updateProduct,
  updateVariant,
} from "../actions";
import { ImageManager } from "../image-manager";
import { ProductForm } from "../product-form";
import { VariantManager } from "../variant-manager";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          select: {
            id: true,
            sku: true,
            name: true,
            price: true,
            salePrice: true,
            stock: true,
            weight: true,
          },
          orderBy: { name: "asc" },
        },
        images: {
          select: { id: true, url: true, alt: true, position: true },
          orderBy: { position: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <PageHeader title="Chỉnh sửa sản phẩm" description={product.name} />
        <ProductForm
          categories={categories}
          brands={brands}
          action={updateProduct.bind(null, id)}
          defaultValues={{
            name: product.name,
            description: product.description,
            ingredients: product.ingredients,
            howToUse: product.howToUse,
            categoryId: product.categoryId,
            brandId: product.brandId,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
          }}
          submitLabel="Lưu thay đổi"
        />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">
          Phiên bản
        </h2>
        <VariantManager
          productId={id}
          variants={product.variants}
          createAction={createVariant}
          updateAction={updateVariant}
          deleteAction={deleteVariant}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">
          Hình ảnh
        </h2>
        <ImageManager
          productId={id}
          images={product.images}
          createAction={createImage}
          deleteAction={deleteImage}
        />
      </section>
    </div>
  );
}

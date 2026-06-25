import { PageHeader } from "@/features/admin";
import { prisma } from "@/lib/db";

import { createProduct } from "../actions";
import { ProductForm } from "../product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Thêm sản phẩm"
        description="Tạo sản phẩm mới cho cửa hàng."
      />
      <ProductForm
        categories={categories}
        brands={brands}
        action={createProduct}
        submitLabel="Tạo sản phẩm"
      />
    </div>
  );
}

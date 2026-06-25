import type { Prisma } from "@prisma/client";
import Link from "next/link";

import { Badge, Button, Input, Select } from "@/components/ui";
import {
  DataTable,
  DeleteButton,
  FilterBar,
  PageHeader,
  Pagination,
  type Column,
} from "@/features/admin";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
  brand: { name: string };
  variants: { price: number; stock: number }[];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    status?: string;
    stock?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const categoryParam = sp.category?.trim() ?? "";
  const category = categories.some((c) => c.slug === categoryParam)
    ? categoryParam
    : "";
  const brandParam = sp.brand?.trim() ?? "";
  const brand = brands.some((b) => b.slug === brandParam) ? brandParam : "";

  const statusParam = sp.status ?? "";
  const status =
    statusParam === "active" ||
    statusParam === "inactive" ||
    statusParam === "featured"
      ? statusParam
      : "";

  const stockParam = sp.stock ?? "";
  const stock = stockParam === "in" || stockParam === "out" ? stockParam : "";

  const sortParam = sp.sort ?? "";
  const sort =
    sortParam === "name" || sortParam === "stock" ? sortParam : "newest";

  const where: Prisma.ProductWhereInput = {};
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (category) where.category = { slug: category };
  if (brand) where.brand = { slug: brand };
  if (status === "active") where.isActive = true;
  else if (status === "inactive") where.isActive = false;
  else if (status === "featured") where.isFeatured = true;
  if (stock === "in") where.variants = { some: { stock: { gt: 0 } } };
  else if (stock === "out") where.variants = { none: { stock: { gt: 0 } } };

  // 'stock' cannot be ordered directly (it is a sum across variants), so it
  // falls back to newest-first ordering.
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "name" ? { name: "asc" } : { createdAt: "desc" };

  const hasActiveFilters =
    !!(q || category || brand || status || stock) || sort !== "newest";

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        variants: { select: { price: true, stock: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: Column<ProductRow>[] = [
    {
      header: "Tên",
      cell: (row) => (
        <div>
          <p className="font-medium text-neutral-900">{row.name}</p>
          <p className="text-xs text-neutral-400">{row.slug}</p>
        </div>
      ),
    },
    {
      header: "Danh mục",
      cell: (row) => <Badge variant="neutral">{row.category.name}</Badge>,
    },
    {
      header: "Thương hiệu",
      cell: (row) => row.brand.name,
    },
    {
      header: "Giá",
      align: "right",
      cell: (row) =>
        row.variants.length > 0
          ? formatPrice(Math.min(...row.variants.map((v) => v.price)))
          : "—",
    },
    {
      header: "Tồn kho",
      align: "right",
      cell: (row) => row.variants.reduce((sum, v) => sum + v.stock, 0),
    },
    {
      header: "Trạng thái",
      cell: (row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          {row.isActive ? (
            <Badge variant="success">Hiển thị</Badge>
          ) : (
            <Badge variant="neutral">Ẩn</Badge>
          )}
          {row.isFeatured && <Badge variant="brand">Nổi bật</Badge>}
        </div>
      ),
    },
    {
      header: "Thao tác",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/products/${row.id}`}>Sửa</Link>
          </Button>
          <DeleteButton action={deleteProduct.bind(null, row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Sản phẩm"
        action={
          <Button asChild>
            <Link href="/admin/products/new">+ Thêm sản phẩm</Link>
          </Button>
        }
      />

      <FilterBar basePath="/admin/products" hasActiveFilters={hasActiveFilters}>
        <Input
          name="q"
          label="Tìm kiếm"
          placeholder="Tên sản phẩm…"
          defaultValue={q}
          className="h-9 w-48"
        />
        <Select
          name="category"
          label="Danh mục"
          defaultValue={category}
          className="h-9 w-44"
        >
          <option value="">Tất cả</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          name="brand"
          label="Thương hiệu"
          defaultValue={brand}
          className="h-9 w-44"
        >
          <option value="">Tất cả</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Trạng thái"
          defaultValue={status}
          className="h-9 w-40"
        >
          <option value="">Tất cả</option>
          <option value="active">Hiển thị</option>
          <option value="inactive">Ẩn</option>
          <option value="featured">Nổi bật</option>
        </Select>
        <Select
          name="stock"
          label="Tồn kho"
          defaultValue={stock}
          className="h-9 w-40"
        >
          <option value="">Tất cả</option>
          <option value="in">Còn hàng</option>
          <option value="out">Hết hàng</option>
        </Select>
        <Select
          name="sort"
          label="Sắp xếp"
          defaultValue={sort}
          className="h-9 w-40"
        >
          <option value="newest">Mới nhất</option>
          <option value="name">Tên A→Z</option>
          <option value="stock">Tồn kho</option>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        getKey={(row) => row.id}
        empty="Chưa có sản phẩm nào."
      />

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

import Link from "next/link";

import { Button, Input, Textarea } from "@/components/ui";
import {
  DataTable,
  DeleteButton,
  PageHeader,
  type Column,
} from "@/features/admin";
import { prisma } from "@/lib/db";

import { createBrand, deleteBrand, updateBrand } from "./actions";

export const dynamic = "force-dynamic";

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  country: string | null;
};

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const sp = await searchParams;
  const editId = sp.edit?.trim() || "";

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  const editing = editId ? (brands.find((b) => b.id === editId) ?? null) : null;

  const columns: Column<BrandRow>[] = [
    {
      header: "Tên",
      cell: (row) => (
        <span className="font-medium text-neutral-900">{row.name}</span>
      ),
    },
    {
      header: "Slug",
      cell: (row) => (
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600">
          {row.slug}
        </code>
      ),
    },
    {
      header: "Quốc gia",
      cell: (row) => row.country ?? "—",
    },
    {
      header: "Thao tác",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/brands?edit=${row.id}`}
            className="text-brand-500 hover:bg-brand-50 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
          >
            Sửa
          </Link>
          <DeleteButton action={deleteBrand.bind(null, row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Thương hiệu"
        description="Quản lý thương hiệu sản phẩm."
      />

      <form
        action={editing ? updateBrand.bind(null, editing.id) : createBrand}
        className="mb-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <h2 className="text-sm font-semibold text-neutral-900">
          {editing ? "Sửa thương hiệu" : "Thêm thương hiệu mới"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="name"
            name="name"
            label="Tên thương hiệu"
            required
            defaultValue={editing?.name ?? ""}
          />
          <Input
            id="slug"
            name="slug"
            label="Slug"
            placeholder="tự động nếu để trống"
            defaultValue={editing?.slug ?? ""}
          />
        </div>

        <Input
          id="country"
          name="country"
          label="Quốc gia"
          defaultValue={editing?.country ?? ""}
        />

        <Textarea
          id="description"
          name="description"
          label="Mô tả"
          defaultValue={editing?.description ?? ""}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">
            {editing ? "Cập nhật" : "Thêm thương hiệu"}
          </Button>
          {editing && (
            <Button asChild variant="ghost">
              <Link href="/admin/brands">Hủy</Link>
            </Button>
          )}
        </div>
      </form>

      <DataTable<BrandRow>
        columns={columns}
        rows={brands}
        getKey={(row) => row.id}
        empty="Chưa có thương hiệu nào."
      />
    </div>
  );
}

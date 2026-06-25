import Link from "next/link";

import { Button, Input, Select, Textarea } from "@/components/ui";
import {
  DataTable,
  DeleteButton,
  PageHeader,
  type Column,
} from "@/features/admin";
import { prisma } from "@/lib/db";

import { createCategory, deleteCategory, updateCategory } from "./actions";

export const dynamic = "force-dynamic";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  parent: { name: string } | null;
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const sp = await searchParams;
  const editId = sp.edit?.trim() || "";

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { parent: { select: { name: true } } },
  });

  const editing = editId
    ? (categories.find((c) => c.id === editId) ?? null)
    : null;

  const columns: Column<CategoryRow>[] = [
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
      header: "Danh mục cha",
      cell: (row) => row.parent?.name ?? "—",
    },
    {
      header: "Thao tác",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/categories?edit=${row.id}`}
            className="text-brand-500 hover:bg-brand-50 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
          >
            Sửa
          </Link>
          <DeleteButton action={deleteCategory.bind(null, row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Danh mục" description="Quản lý danh mục sản phẩm." />

      <form
        action={
          editing ? updateCategory.bind(null, editing.id) : createCategory
        }
        className="mb-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <h2 className="text-sm font-semibold text-neutral-900">
          {editing ? "Sửa danh mục" : "Thêm danh mục mới"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="name"
            name="name"
            label="Tên danh mục"
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

        <Textarea
          id="description"
          name="description"
          label="Mô tả"
          defaultValue={editing?.description ?? ""}
        />

        <Select
          id="parentId"
          name="parentId"
          label="Danh mục cha"
          defaultValue={editing?.parentId ?? ""}
        >
          <option value="">— Không có —</option>
          {categories
            .filter((c) => c.id !== editing?.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </Select>

        <div className="flex items-center gap-3">
          <Button type="submit">
            {editing ? "Cập nhật" : "Thêm danh mục"}
          </Button>
          {editing && (
            <Button asChild variant="ghost">
              <Link href="/admin/categories">Hủy</Link>
            </Button>
          )}
        </div>
      </form>

      <DataTable<CategoryRow>
        columns={columns}
        rows={categories}
        getKey={(row) => row.id}
        empty="Chưa có danh mục nào."
      />
    </div>
  );
}

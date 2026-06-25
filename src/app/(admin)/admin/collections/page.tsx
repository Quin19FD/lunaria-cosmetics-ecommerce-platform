import Link from "next/link";

import { Button, Input, Textarea } from "@/components/ui";
import {
  DataTable,
  DeleteButton,
  PageHeader,
  type Column,
} from "@/features/admin";
import { collectionService, type Collection } from "@/modules/collections";

import {
  createCollection,
  deleteCollection,
  updateCollection,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const sp = await searchParams;
  const editId = sp.edit?.trim() || "";

  const collections = await collectionService.getAll();

  const editing = editId
    ? (collections.find((c) => c.id === editId) ?? null)
    : null;

  const columns: Column<Collection>[] = [
    {
      header: "Tên",
      cell: (row) => (
        <span className="font-medium text-neutral-900">{row.name}</span>
      ),
    },
    {
      header: "Slug",
      cell: (row) => (
        <code className="font-mono text-xs text-neutral-500">{row.slug}</code>
      ),
    },
    {
      header: "Label",
      cell: (row) => row.label || "—",
    },
    {
      header: "Sản phẩm",
      cell: (row) => row.productSlugs.length,
    },
    {
      header: "Thao tác",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/collections?edit=${row.id}`}
            className="text-brand-500 hover:bg-brand-50 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
          >
            Sửa
          </Link>
          <DeleteButton action={deleteCollection.bind(null, row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Bộ sưu tập" description="Quản lý bộ sưu tập." />

      <form
        action={
          editing ? updateCollection.bind(null, editing.id) : createCollection
        }
        className="mb-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <h2 className="text-sm font-semibold text-neutral-900">
          {editing ? "Sửa bộ sưu tập" : "Thêm bộ sưu tập mới"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="name"
            name="name"
            label="Tên"
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
          <Input
            id="badge"
            name="badge"
            label="Nhãn badge"
            defaultValue={editing?.badge ?? ""}
          />
          <Input
            id="label"
            name="label"
            label="Label"
            defaultValue={editing?.label ?? ""}
          />
          <Input
            id="headline"
            name="headline"
            label="Tiêu đề lớn"
            defaultValue={editing?.headline ?? ""}
          />
          <Input
            id="highlightWord"
            name="highlightWord"
            label="Từ nhấn mạnh"
            defaultValue={editing?.highlightWord ?? ""}
          />
        </div>

        <Textarea
          id="summary"
          name="summary"
          label="Tóm tắt"
          defaultValue={editing?.summary ?? ""}
        />

        <Textarea
          id="description"
          name="description"
          label="Mô tả — mỗi đoạn một dòng"
          defaultValue={editing?.description.join("\n") ?? ""}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="ctaLabel"
            name="ctaLabel"
            label="Nhãn CTA"
            defaultValue={editing?.ctaLabel ?? ""}
          />
          <Input
            id="heroImage"
            name="heroImage"
            label="Hero image URL"
            defaultValue={editing?.heroImage ?? ""}
          />
          <Input
            id="cardImage"
            name="cardImage"
            label="Card image URL"
            defaultValue={editing?.cardImage ?? ""}
          />
        </div>

        <Textarea
          id="productSlugs"
          name="productSlugs"
          label="Slug sản phẩm, mỗi dòng một slug"
          defaultValue={editing?.productSlugs.join("\n") ?? ""}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">
            {editing ? "Cập nhật" : "Thêm bộ sưu tập"}
          </Button>
          {editing && (
            <Button asChild variant="ghost">
              <Link href="/admin/collections">Hủy</Link>
            </Button>
          )}
        </div>
      </form>

      <DataTable<Collection>
        columns={columns}
        rows={collections}
        getKey={(row) => row.id}
        empty="Chưa có bộ sưu tập nào."
      />
    </div>
  );
}

import type { Promotion } from "@prisma/client";
import Link from "next/link";

import { Badge, Button, Input, Select, Textarea } from "@/components/ui";
import {
  DataTable,
  DeleteButton,
  PageHeader,
  type Column,
} from "@/features/admin";
import { prisma } from "@/lib/db";

import {
  createPromotion,
  deletePromotion,
  togglePromotion,
  updatePromotion,
} from "./actions";

export const dynamic = "force-dynamic";

const COLOR_BADGE: Record<
  Promotion["color"],
  "brand" | "purple" | "warning" | "success"
> = {
  pink: "brand",
  purple: "purple",
  amber: "warning",
  emerald: "success",
};

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const sp = await searchParams;
  const editId = sp.edit?.trim() || "";

  const promotions = await prisma.promotion.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  const editing = editId
    ? (promotions.find((p) => p.id === editId) ?? null)
    : null;

  const columns: Column<Promotion>[] = [
    {
      header: "Tiêu đề",
      cell: (row) => (
        <span className="font-medium text-neutral-900">{row.title}</span>
      ),
    },
    {
      header: "Mã",
      cell: (row) => (
        <span className="font-mono text-neutral-900">{row.code}</span>
      ),
    },
    {
      header: "Giảm",
      cell: (row) => <Badge variant="brand">{row.discount}</Badge>,
    },
    {
      header: "Màu",
      cell: (row) => (
        <Badge variant={COLOR_BADGE[row.color]}>{row.color}</Badge>
      ),
    },
    {
      header: "Hết hạn",
      cell: (row) => row.endDate || "—",
    },
    {
      header: "Sản phẩm",
      cell: (row) => row.productSlugs.length,
    },
    {
      header: "Trạng thái",
      cell: (row) =>
        row.active ? (
          <Badge variant="success">Đang bật</Badge>
        ) : (
          <Badge variant="neutral">Tắt</Badge>
        ),
    },
    {
      header: "Thao tác",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/promotions?edit=${row.id}`}
            className="text-brand-500 hover:bg-brand-50 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
          >
            Sửa
          </Link>
          <form action={togglePromotion.bind(null, row.id)}>
            <button
              type="submit"
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              {row.active ? "Tắt" : "Bật"}
            </button>
          </form>
          <DeleteButton action={deletePromotion.bind(null, row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Khuyến mãi"
        description="Quản lý chương trình khuyến mãi."
      />

      <form
        action={
          editing ? updatePromotion.bind(null, editing.id) : createPromotion
        }
        className="mb-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <h2 className="text-sm font-semibold text-neutral-900">
          {editing ? "Sửa khuyến mãi" : "Thêm khuyến mãi mới"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="title"
            name="title"
            label="Tiêu đề"
            required
            defaultValue={editing?.title ?? ""}
          />
          <Input
            id="subtitle"
            name="subtitle"
            label="Phụ đề"
            defaultValue={editing?.subtitle ?? ""}
          />

          <Input
            id="code"
            name="code"
            label="Mã"
            required
            placeholder="VD: SUMMER40"
            defaultValue={editing?.code ?? ""}
          />
          <Input
            id="discount"
            name="discount"
            label="Giảm giá"
            placeholder="VD: 40% hoặc Tặng 1"
            defaultValue={editing?.discount ?? ""}
          />

          <Input
            id="endDate"
            name="endDate"
            type="date"
            label="Hết hạn"
            defaultValue={editing?.endDate ?? ""}
          />
          <Select
            id="color"
            name="color"
            label="Màu"
            defaultValue={editing?.color ?? "pink"}
          >
            <option value="pink">pink</option>
            <option value="purple">purple</option>
            <option value="amber">amber</option>
            <option value="emerald">emerald</option>
          </Select>

          <Input
            id="image"
            name="image"
            label="Ảnh (URL)"
            className="sm:col-span-2"
            defaultValue={editing?.image ?? ""}
          />
        </div>

        <Textarea
          id="description"
          name="description"
          label="Mô tả"
          defaultValue={editing?.description ?? ""}
        />

        <Textarea
          id="productSlugs"
          name="productSlugs"
          label="Slug sản phẩm, mỗi dòng một slug"
          defaultValue={editing?.productSlugs.join("\n") ?? ""}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked={editing ? editing.active : true}
            className="text-brand-500 focus:ring-brand-500/40 h-4 w-4 rounded border-neutral-300"
          />
          Kích hoạt
        </label>

        <div className="flex items-center gap-3">
          <Button type="submit">
            {editing ? "Cập nhật" : "Thêm khuyến mãi"}
          </Button>
          {editing && (
            <Button asChild variant="ghost">
              <Link href="/admin/promotions">Hủy</Link>
            </Button>
          )}
        </div>
      </form>

      <DataTable<Promotion>
        columns={columns}
        rows={promotions}
        getKey={(row) => row.id}
        empty="Chưa có khuyến mãi nào."
      />
    </div>
  );
}

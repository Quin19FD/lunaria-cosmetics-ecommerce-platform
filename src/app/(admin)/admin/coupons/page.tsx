import Link from "next/link";

import { Badge, Button, Input, Select } from "@/components/ui";
import {
  DataTable,
  DeleteButton,
  PageHeader,
  type Column,
} from "@/features/admin";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

import {
  createCoupon,
  deleteCoupon,
  toggleCoupon,
  updateCoupon,
} from "./actions";

export const dynamic = "force-dynamic";

type CouponRow = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  active: boolean;
  expiresAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
};

export default async function CouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const sp = await searchParams;
  const editId = sp.edit?.trim() || "";

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const editing = editId
    ? (coupons.find((c) => c.id === editId) ?? null)
    : null;

  const columns: Column<CouponRow>[] = [
    {
      header: "Mã",
      cell: (row) => (
        <span className="font-mono font-medium text-neutral-900">
          {row.code}
        </span>
      ),
    },
    {
      header: "Loại",
      cell: (row) => (
        <Badge variant="brand">
          {row.type === "PERCENT" ? `${row.value}%` : formatPrice(row.value)}
        </Badge>
      ),
    },
    {
      header: "Đơn tối thiểu",
      cell: (row) => (row.minOrder > 0 ? formatPrice(row.minOrder) : "—"),
    },
    {
      header: "Đã dùng",
      cell: (row) => `${row.usedCount}/${row.usageLimit ?? "∞"}`,
    },
    {
      header: "Hết hạn",
      cell: (row) => (row.expiresAt ? formatDate(row.expiresAt) : "—"),
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
            href={`/admin/coupons?edit=${row.id}`}
            className="text-brand-500 hover:bg-brand-50 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
          >
            Sửa
          </Link>
          <form action={toggleCoupon.bind(null, row.id)}>
            <button
              type="submit"
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              {row.active ? "Tắt" : "Bật"}
            </button>
          </form>
          <DeleteButton action={deleteCoupon.bind(null, row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Mã giảm giá" description="Quản lý mã giảm giá." />

      <form
        action={editing ? updateCoupon.bind(null, editing.id) : createCoupon}
        className="mb-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <h2 className="text-sm font-semibold text-neutral-900">
          {editing ? "Sửa mã giảm giá" : "Thêm mã giảm giá mới"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="code"
            name="code"
            label="Mã giảm giá"
            required
            placeholder="VD: SALE10"
            defaultValue={editing?.code ?? ""}
          />
          <Select
            id="type"
            name="type"
            label="Loại"
            defaultValue={editing?.type ?? "PERCENT"}
          >
            <option value="PERCENT">Phần trăm (%)</option>
            <option value="FIXED">Số tiền (₫)</option>
          </Select>

          <Input
            id="value"
            name="value"
            type="number"
            label="Giá trị"
            required
            min={1}
            defaultValue={editing?.value ?? ""}
          />
          <Input
            id="minOrder"
            name="minOrder"
            type="number"
            label="Đơn tối thiểu (₫)"
            min={0}
            defaultValue={editing?.minOrder ?? ""}
          />

          <Input
            id="maxDiscount"
            name="maxDiscount"
            type="number"
            label="Giảm tối đa (₫)"
            min={0}
            placeholder="Chỉ áp dụng cho phần trăm"
            defaultValue={editing?.maxDiscount ?? ""}
          />
          <Input
            id="usageLimit"
            name="usageLimit"
            type="number"
            label="Giới hạn lượt"
            min={0}
            defaultValue={editing?.usageLimit ?? ""}
          />

          <Input
            id="expiresAt"
            name="expiresAt"
            type="date"
            label="Hết hạn"
            defaultValue={
              editing?.expiresAt
                ? editing.expiresAt.toISOString().slice(0, 10)
                : ""
            }
          />
        </div>

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
          <Button type="submit">{editing ? "Cập nhật" : "Thêm mã"}</Button>
          {editing && (
            <Button asChild variant="ghost">
              <Link href="/admin/coupons">Hủy</Link>
            </Button>
          )}
        </div>
      </form>

      <DataTable<CouponRow>
        columns={columns}
        rows={coupons}
        getKey={(row) => row.id}
        empty="Chưa có mã giảm giá nào."
      />
    </div>
  );
}

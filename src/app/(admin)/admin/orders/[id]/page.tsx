import type { OrderStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { Badge, Button, Input, Select } from "@/components/ui";
import { DataTable, PageHeader, type Column } from "@/features/admin";
import { prisma } from "@/lib/db";
import { formatDateTime, formatPrice } from "@/lib/utils";

import { updateOrderStatus } from "../actions";

export const dynamic = "force-dynamic";

type StatusMeta = {
  label: string;
  variant: "warning" | "info" | "purple" | "success" | "danger" | "neutral";
};

const STATUS_MAP: Record<OrderStatus, StatusMeta> = {
  PENDING: { label: "Chờ xử lý", variant: "warning" },
  CONFIRMED: { label: "Đã xác nhận", variant: "info" },
  PROCESSING: { label: "Đang xử lý", variant: "info" },
  SHIPPED: { label: "Đang giao", variant: "purple" },
  DELIVERED: { label: "Hoàn thành", variant: "success" },
  CANCELLED: { label: "Đã hủy", variant: "danger" },
  REFUNDED: { label: "Hoàn tiền", variant: "neutral" },
};

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  if (!order) notFound();

  const code = order.id.slice(0, 8).toUpperCase();
  const meta = STATUS_MAP[order.status];

  type ItemRow = (typeof order.items)[number];

  const columns: Column<ItemRow>[] = [
    {
      header: "Sản phẩm",
      cell: (it) => (
        <div>
          <p className="font-medium text-neutral-900">
            {it.variant.product.name}
          </p>
          <p className="text-xs text-neutral-500">{it.variant.name}</p>
        </div>
      ),
    },
    {
      header: "SL",
      align: "center",
      cell: (it) => it.quantity,
    },
    {
      header: "Đơn giá",
      align: "right",
      cell: (it) => formatPrice(it.unitPrice),
    },
    {
      header: "Thành tiền",
      align: "right",
      cell: (it) => (
        <span className="font-medium text-neutral-900">
          {formatPrice(it.unitPrice * it.quantity)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Đơn ${code}`}
        description={`Đặt ngày ${formatDateTime(order.createdAt)}`}
        action={<Badge variant={meta.variant}>{meta.label}</Badge>}
      />

      <form
        action={updateOrderStatus.bind(null, order.id)}
        className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <h2 className="mb-4 text-sm font-semibold text-neutral-900">
          Cập nhật trạng thái
        </h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Select name="status" label="Trạng thái" defaultValue={order.status}>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_MAP[s].label}
              </option>
            ))}
          </Select>
          <Input
            name="trackingCode"
            label="Mã vận đơn"
            defaultValue={order.trackingCode ?? ""}
            placeholder="Nhập mã vận đơn"
          />
          <Button type="submit">Cập nhật</Button>
        </div>
      </form>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            rows={order.items}
            getKey={(it) => it.id}
            empty="Đơn hàng không có sản phẩm."
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">
              Khách hàng
            </h2>
            <div className="space-y-1 text-sm text-neutral-700">
              <p className="font-medium text-neutral-900">
                {order.user.name ?? order.user.email}
              </p>
              <p className="text-neutral-500">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-neutral-500">{order.user.phone}</p>
              )}
            </div>

            <h2 className="mt-5 mb-3 text-sm font-semibold text-neutral-900">
              Địa chỉ giao hàng
            </h2>
            <div className="space-y-1 text-sm text-neutral-700">
              <p className="font-medium text-neutral-900">
                {order.address.fullName}
              </p>
              <p className="text-neutral-500">{order.address.phone}</p>
              <p>
                {order.address.street}
                {order.address.ward ? `, ${order.address.ward}` : ""},{" "}
                {order.address.district}, {order.address.city}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">
              Tổng kết
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <dt>Tạm tính</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between text-neutral-600">
                <dt>Phí vận chuyển</dt>
                <dd>{formatPrice(order.shippingCost)}</dd>
              </div>
              <div className="flex items-center justify-between text-neutral-600">
                <dt>Giảm giá</dt>
                <dd>-{formatPrice(order.discount)}</dd>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-3 text-base font-semibold text-neutral-900">
                <dt>Tổng cộng</dt>
                <dd className="text-brand-600">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

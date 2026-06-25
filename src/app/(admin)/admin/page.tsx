import type { Prisma } from "@prisma/client";
import { type OrderStatus } from "@prisma/client";
import {
  CalendarRange,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge, type BadgeProps, Button, Select } from "@/components/ui";
import { DataTable, PageHeader, StatCard, type Column } from "@/features/admin";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type RecentOrder = Prisma.OrderGetPayload<{
  include: {
    user: true;
    items: { include: { variant: { include: { product: true } } } };
  };
}>;

type LowStockVariant = Prisma.ProductVariantGetPayload<{
  include: { product: true };
}>;

const STATUS_META: Record<
  OrderStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  PENDING: { label: "Chờ xử lý", variant: "warning" },
  CONFIRMED: { label: "Đã xác nhận", variant: "info" },
  PROCESSING: { label: "Đang xử lý", variant: "info" },
  SHIPPED: { label: "Đang giao", variant: "purple" },
  DELIVERED: { label: "Hoàn thành", variant: "success" },
  CANCELLED: { label: "Đã hủy", variant: "danger" },
  REFUNDED: { label: "Hoàn tiền", variant: "neutral" },
};

const RANGE_OPTIONS = [
  { value: "7", label: "7 ngày qua" },
  { value: "30", label: "30 ngày qua" },
  { value: "90", label: "90 ngày qua" },
  { value: "all", label: "Toàn thời gian" },
] as const;

type RangeValue = (typeof RANGE_OPTIONS)[number]["value"];

const orderColumns: Column<RecentOrder>[] = [
  {
    header: "Mã đơn",
    cell: (order) => (
      <span className="font-mono text-xs font-semibold text-neutral-900">
        {order.id.slice(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    header: "Ngày",
    cell: (order) => formatDate(order.createdAt),
  },
  {
    header: "Khách",
    cell: (order) => order.user.name ?? order.user.email,
  },
  {
    header: "Trạng thái",
    cell: (order) => {
      const meta = STATUS_META[order.status];
      return <Badge variant={meta.variant}>{meta.label}</Badge>;
    },
  },
  {
    header: "Tổng",
    align: "right",
    cell: (order) => formatPrice(order.total),
  },
];

const lowStockColumns: Column<LowStockVariant>[] = [
  {
    header: "Sản phẩm",
    cell: (variant) => variant.product.name,
  },
  {
    header: "Phiên bản",
    cell: (variant) => variant.name,
  },
  {
    header: "Tồn kho",
    align: "right",
    cell: (variant) => (
      <Badge variant={variant.stock === 0 ? "danger" : "warning"}>
        {variant.stock}
      </Badge>
    ),
  },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const rawRange = (await searchParams).range;
  const range: RangeValue = RANGE_OPTIONS.some((o) => o.value === rawRange)
    ? (rawRange as RangeValue)
    : "30";
  const rangeLabel = RANGE_OPTIONS.find((o) => o.value === range)!.label;
  const since =
    range === "all"
      ? undefined
      : new Date(Date.now() - Number(range) * 86_400_000);

  const periodWhere: Prisma.OrderWhereInput = {
    status: { notIn: ["CANCELLED", "REFUNDED"] },
    ...(since ? { createdAt: { gte: since } } : {}),
  };

  const [
    revenue,
    orderCount,
    productCount,
    customerCount,
    periodRevenue,
    periodOrderCount,
    recentOrders,
    lowStock,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: periodWhere }),
    prisma.order.count({ where: periodWhere }),
    prisma.order.findMany({
      include: {
        user: true,
        items: { include: { variant: { include: { product: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 10 } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Tổng quan hệ thống"
        action={
          <form method="get" className="flex items-end gap-2">
            <Select
              name="range"
              label="Khoảng thời gian"
              defaultValue={range}
              className="h-9 w-44"
            >
              {RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Button type="submit" size="sm" variant="outline">
              Xem
            </Button>
          </form>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Doanh thu"
          value={formatPrice(revenue._sum.total ?? 0)}
          icon={DollarSign}
        />
        <StatCard
          label="Đơn hàng"
          value={String(orderCount)}
          icon={ShoppingCart}
        />
        <StatCard
          label="Sản phẩm"
          value={String(productCount)}
          icon={Package}
        />
        <StatCard
          label="Khách hàng"
          value={String(customerCount)}
          icon={Users}
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-base font-semibold text-neutral-900">
          Trong kỳ · {rangeLabel}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Doanh thu kỳ"
            value={formatPrice(periodRevenue._sum.total ?? 0)}
            icon={TrendingUp}
          />
          <StatCard
            label="Số đơn kỳ"
            value={String(periodOrderCount)}
            icon={CalendarRange}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900">
            Đơn hàng gần đây
          </h2>
          <DataTable
            columns={orderColumns}
            rows={recentOrders}
            getKey={(order) => order.id}
            empty="Chưa có đơn hàng."
          />
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-neutral-900">
            Sắp hết hàng
          </h2>
          <DataTable
            columns={lowStockColumns}
            rows={lowStock}
            getKey={(variant) => variant.id}
            empty="Tất cả sản phẩm còn đủ hàng."
          />
        </section>
      </div>
    </div>
  );
}

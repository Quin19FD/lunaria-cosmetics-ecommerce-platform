import type { OrderStatus, Prisma } from "@prisma/client";
import Link from "next/link";

import { Badge, Button, Input, Select } from "@/components/ui";
import {
  DataTable,
  FilterBar,
  PageHeader,
  Pagination,
  type Column,
} from "@/features/admin";
import { prisma } from "@/lib/db";
import { formatDateTime, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    q?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const status =
    sp.status && sp.status in STATUS_MAP ? (sp.status as OrderStatus) : "";
  const q = sp.q?.trim() ?? "";
  const from = sp.from ?? "";
  const to = sp.to ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { id: { contains: q, mode: "insensitive" } },
      { user: { name: { contains: q, mode: "insensitive" } } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }
  const fromDate = from ? new Date(`${from}T00:00:00`) : null;
  const toDate = to ? new Date(`${to}T23:59:59`) : null;
  const createdAt: Prisma.DateTimeFilter = {};
  if (fromDate && !Number.isNaN(fromDate.valueOf())) {
    createdAt.gte = fromDate;
  }
  if (toDate && !Number.isNaN(toDate.valueOf())) {
    createdAt.lte = toDate;
  }
  if (createdAt.gte || createdAt.lte) {
    where.createdAt = createdAt;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  type OrderRow = (typeof orders)[number];

  const columns: Column<OrderRow>[] = [
    {
      header: "Mã đơn",
      cell: (o) => (
        <span className="font-mono text-xs font-semibold text-neutral-800">
          {o.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Khách",
      cell: (o) => o.user.name ?? o.user.email,
    },
    {
      header: "Ngày",
      cell: (o) => formatDateTime(o.createdAt),
    },
    {
      header: "Số SP",
      align: "center",
      cell: (o) => o.items.reduce((sum, it) => sum + it.quantity, 0),
    },
    {
      header: "Trạng thái",
      cell: (o) => (
        <Badge variant={STATUS_MAP[o.status].variant}>
          {STATUS_MAP[o.status].label}
        </Badge>
      ),
    },
    {
      header: "Tổng",
      align: "right",
      cell: (o) => (
        <span className="font-medium text-neutral-900">
          {formatPrice(o.total)}
        </span>
      ),
    },
    {
      header: "",
      align: "right",
      cell: (o) => (
        <Button asChild variant="link" size="sm">
          <Link href={`/admin/orders/${o.id}`}>Chi tiết</Link>
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Đơn hàng"
        description="Quản lý và cập nhật trạng thái đơn hàng."
        action={
          <Button asChild size="sm">
            <Link href="/admin/orders/new">+ Tạo đơn</Link>
          </Button>
        }
      />

      <FilterBar
        basePath="/admin/orders"
        hasActiveFilters={!!(status || q || from || to)}
      >
        <Input
          name="q"
          label="Tìm kiếm"
          placeholder="Mã đơn / khách hàng…"
          defaultValue={q}
          className="h-9 w-52"
        />
        <Select
          name="status"
          label="Trạng thái"
          defaultValue={status}
          className="h-9 w-44"
        >
          <option value="">Tất cả</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_MAP[s].label}
            </option>
          ))}
        </Select>
        <Input
          name="from"
          label="Từ ngày"
          type="date"
          defaultValue={from}
          className="h-9 w-40"
        />
        <Input
          name="to"
          label="Đến ngày"
          type="date"
          defaultValue={to}
          className="h-9 w-40"
        />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={orders}
        getKey={(o) => o.id}
        empty="Chưa có đơn hàng nào."
      />

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

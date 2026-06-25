import type { Prisma, UserRole } from "@prisma/client";

import { Badge, Button, Input, Select } from "@/components/ui";
import {
  DataTable,
  FilterBar,
  PageHeader,
  Pagination,
  type Column,
} from "@/features/admin";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

import { updateUserRole } from "./actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: "Khách hàng",
  ADMIN: "Quản trị",
  SUPER_ADMIN: "Quản trị cấp cao",
};

const ROLE_BADGE: Record<UserRole, "purple" | "brand" | "neutral"> = {
  SUPER_ADMIN: "purple",
  ADMIN: "brand",
  CUSTOMER: "neutral",
};

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  _count: { orders: number };
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const role = sp.role && sp.role in ROLE_LABELS ? (sp.role as UserRole) : "";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.UserWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: Column<UserRow>[] = [
    {
      header: "Người dùng",
      cell: (user) => (
        <div>
          <p className="font-medium text-neutral-900">{user.name ?? "—"}</p>
          <p className="text-xs text-neutral-500">{user.email}</p>
        </div>
      ),
    },
    {
      header: "Vai trò hiện tại",
      cell: (user) => (
        <Badge variant={ROLE_BADGE[user.role]}>{ROLE_LABELS[user.role]}</Badge>
      ),
    },
    {
      header: "Đổi vai trò",
      cell: (user) => (
        <form
          action={updateUserRole.bind(null, user.id)}
          className="flex items-center gap-2"
        >
          <Select
            name="role"
            defaultValue={user.role}
            className="h-9 w-44 text-xs"
          >
            <option value="CUSTOMER">Khách hàng</option>
            <option value="ADMIN">Quản trị</option>
            <option value="SUPER_ADMIN">Quản trị cấp cao</option>
          </Select>
          <Button type="submit" size="sm" variant="outline">
            Lưu
          </Button>
        </form>
      ),
    },
    {
      header: "Số đơn",
      align: "center",
      cell: (user) => user._count.orders,
    },
    {
      header: "Ngày tham gia",
      cell: (user) => formatDate(user.createdAt),
    },
  ];

  return (
    <div>
      <PageHeader title="Người dùng" />
      <FilterBar basePath="/admin/users" hasActiveFilters={!!(q || role)}>
        <Input
          name="q"
          label="Tìm kiếm"
          placeholder="Tên hoặc email…"
          defaultValue={q}
          className="h-9 w-56"
        />
        <Select
          name="role"
          label="Vai trò"
          defaultValue={role}
          className="h-9 w-44"
        >
          <option value="">Tất cả</option>
          <option value="CUSTOMER">Khách hàng</option>
          <option value="ADMIN">Quản trị</option>
          <option value="SUPER_ADMIN">Quản trị cấp cao</option>
        </Select>
      </FilterBar>
      <DataTable
        columns={columns}
        rows={rows}
        getKey={(user) => user.id}
        empty="Không tìm thấy người dùng nào."
      />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

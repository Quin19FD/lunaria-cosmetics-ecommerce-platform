import type { OrderStatus } from "@prisma/client";

import { PageHeader } from "@/features/admin";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

import { createOrder } from "../actions";
import { OrderForm } from "../order-form";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đang giao" },
  { value: "DELIVERED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "REFUNDED", label: "Hoàn tiền" },
];

export default async function NewOrderPage() {
  const [users, variants] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productVariant.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        product: { select: { name: true } },
      },
      orderBy: { product: { name: "asc" } },
    }),
  ]);

  const userOptions = users.map((u) => ({
    id: u.id,
    label: u.name ? `${u.name} (${u.email})` : u.email,
  }));
  const variantOptions = variants.map((v) => ({
    id: v.id,
    label: `${v.product.name} — ${v.name} · ${formatPrice(v.price)} · tồn ${v.stock}`,
    price: v.price,
  }));

  return (
    <div>
      <PageHeader
        title="Tạo đơn hàng"
        description="Tạo đơn thủ công cho khách hàng."
      />
      <OrderForm
        users={userOptions}
        variants={variantOptions}
        statuses={STATUS_OPTIONS}
        action={createOrder}
      />
    </div>
  );
}

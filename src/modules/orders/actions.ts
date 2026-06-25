"use server";

import type { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

export interface PlaceOrderInput {
  items: { productId: string; quantity: number }[];
  fullName: string;
  phone: string;
  street: string;
  ward?: string;
  district: string;
  city: string;
  note?: string;
}

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "Vui lòng đăng nhập để đặt hàng." };
  }

  const lines = input.items.filter((i) => i.quantity > 0);
  if (lines.length === 0) {
    return { ok: false, error: "Giỏ hàng trống." };
  }

  if (
    !input.fullName.trim() ||
    !input.phone.trim() ||
    !input.street.trim() ||
    !input.district.trim() ||
    !input.city.trim()
  ) {
    return { ok: false, error: "Vui lòng nhập đầy đủ thông tin giao hàng." };
  }

  // Resolve each product to its cheapest active variant (matches the price
  // shown on the storefront, which uses the minimum variant price).
  const items: { variantId: string; quantity: number; unitPrice: number }[] =
    [];
  let subtotal = 0;
  for (const line of lines) {
    const variant = await prisma.productVariant.findFirst({
      where: { productId: line.productId, product: { isActive: true } },
      orderBy: { price: "asc" },
      select: { id: true, price: true },
    });
    if (!variant) {
      return { ok: false, error: "Một sản phẩm trong giỏ không còn khả dụng." };
    }
    subtotal += variant.price * line.quantity;
    items.push({
      variantId: variant.id,
      quantity: line.quantity,
      unitPrice: variant.price,
    });
  }

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingCost;

  const order = await prisma.order.create({
    data: {
      user: { connect: { id: userId } },
      status: "PENDING",
      note: input.note?.trim() || null,
      subtotal,
      shippingCost,
      total,
      address: {
        create: {
          user: { connect: { id: userId } },
          fullName: input.fullName.trim(),
          phone: input.phone.trim(),
          street: input.street.trim(),
          ward: input.ward?.trim() || null,
          district: input.district.trim(),
          city: input.city.trim(),
        },
      },
      items: { create: items },
    },
    select: { id: true },
  });

  revalidatePath("/admin/orders");
  return { ok: true, orderId: order.id };
}

export interface MyOrderRow {
  id: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: Date;
}

export async function getMyOrders(): Promise<MyOrderRow[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { select: { quantity: true } } },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => ({
    id: o.id,
    status: o.status,
    total: o.total,
    itemCount: o.items.reduce((sum, it) => sum + it.quantity, 0),
    createdAt: o.createdAt,
  }));
}

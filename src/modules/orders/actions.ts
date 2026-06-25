"use server";

import type { OrderStatus, PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeDiscount } from "@/modules/coupons/discount";

import { sendOrderConfirmationEmail } from "./emails";

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

export interface PlaceOrderInput {
  items: { variantId: string; quantity: number }[];
  fullName: string;
  phone: string;
  street: string;
  ward?: string;
  district: string;
  city: string;
  note?: string;
  addressId?: string;
  paymentMethod?: PaymentMethod;
  couponCode?: string;
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

  // Address: use a saved address if provided (and owned), else require a new one.
  const addressId = input.addressId;
  if (addressId) {
    const owned = await prisma.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true },
    });
    if (!owned) return { ok: false, error: "Địa chỉ không hợp lệ." };
  } else if (
    !input.fullName.trim() ||
    !input.phone.trim() ||
    !input.street.trim() ||
    !input.district.trim() ||
    !input.city.trim()
  ) {
    return { ok: false, error: "Vui lòng nhập đầy đủ thông tin giao hàng." };
  }

  try {
    const orderId = await prisma.$transaction(async (tx) => {
      const items: {
        variantId: string;
        quantity: number;
        unitPrice: number;
      }[] = [];
      let subtotal = 0;

      for (const line of lines) {
        const variant = await tx.productVariant.findFirst({
          where: { id: line.variantId, product: { isActive: true } },
          select: {
            id: true,
            name: true,
            price: true,
            salePrice: true,
            stock: true,
          },
        });
        if (!variant) {
          throw new Error("Một sản phẩm trong giỏ không còn khả dụng.");
        }
        if (variant.stock < line.quantity) {
          throw new Error(
            `Sản phẩm "${variant.name}" chỉ còn ${variant.stock} trong kho.`,
          );
        }
        const unitPrice = variant.salePrice ?? variant.price;
        subtotal += unitPrice * line.quantity;
        items.push({
          variantId: variant.id,
          quantity: line.quantity,
          unitPrice,
        });

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: line.quantity } },
        });
      }

      const shippingCost =
        subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

      // Validate + consume coupon atomically.
      let discount = 0;
      let couponCode: string | null = null;
      const rawCode = input.couponCode?.trim().toUpperCase();
      if (rawCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: rawCode } });
        const valid =
          coupon &&
          coupon.active &&
          (!coupon.expiresAt || coupon.expiresAt >= new Date()) &&
          (coupon.usageLimit == null || coupon.usedCount < coupon.usageLimit) &&
          subtotal >= coupon.minOrder;
        if (!valid) {
          throw new Error("Mã giảm giá không hợp lệ hoặc không đủ điều kiện.");
        }
        discount = computeDiscount(coupon, subtotal);
        couponCode = coupon.code;
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      const total = Math.max(0, subtotal + shippingCost - discount);

      const order = await tx.order.create({
        data: {
          user: { connect: { id: userId } },
          status: "PENDING",
          paymentMethod: input.paymentMethod ?? "COD",
          paymentStatus: "UNPAID",
          note: input.note?.trim() || null,
          subtotal,
          shippingCost,
          discount,
          couponCode,
          total,
          address: addressId
            ? { connect: { id: addressId } }
            : {
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

      // Clear the user's persisted cart on successful checkout.
      await tx.cart.deleteMany({ where: { userId } });

      return order.id;
    });

    revalidatePath("/admin/orders");
    // Card orders receive their confirmation from the Stripe webhook post-payment.
    if ((input.paymentMethod ?? "COD") !== "CARD") {
      try {
        await sendOrderConfirmationEmail(orderId);
      } catch {}
    }
    return { ok: true, orderId };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Không thể tạo đơn hàng.";
    return { ok: false, error: message };
  }
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

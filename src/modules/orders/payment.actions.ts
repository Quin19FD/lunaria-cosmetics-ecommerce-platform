"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type PayOrderResult = { ok: true } | { ok: false; error: string };

/**
 * Marks a CARD order as paid. Simulated card processing — a real PSP
 * (Stripe/VNPay/MoMo) would verify a webhook/callback here. Validates that the
 * order belongs to the user and is an unpaid card order before confirming.
 */
export async function payOrder(orderId: string): Promise<PayOrderResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Phiên đăng nhập đã hết hạn." };

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    select: { id: true, paymentStatus: true, paymentMethod: true },
  });
  if (!order) return { ok: false, error: "Không tìm thấy đơn hàng." };
  if (order.paymentStatus === "PAID") return { ok: true };
  if (order.paymentMethod !== "CARD") {
    return { ok: false, error: "Đơn hàng này không thanh toán bằng thẻ." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "PAID", status: "CONFIRMED" },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}

"use server";

import type { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

export async function updateOrderStatus(id: string, formData: FormData) {
  const status = formData.get("status") as OrderStatus;
  const trackingCode =
    String(formData.get("trackingCode") ?? "").trim() || null;

  await prisma.order.update({
    where: { id },
    data: { status, trackingCode },
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

export async function createOrder(formData: FormData) {
  const userId = String(formData.get("userId") ?? "").trim();
  if (!userId) throw new Error("Vui lòng chọn khách hàng.");

  const status = (formData.get("status") as OrderStatus) ?? "PENDING";
  const note = String(formData.get("note") ?? "").trim() || null;
  const shippingCost = Math.max(
    0,
    Math.round(Number(formData.get("shippingCost")) || 0),
  );
  const discount = Math.max(
    0,
    Math.round(Number(formData.get("discount")) || 0),
  );

  const variantIds = formData.getAll("variantId").map((v) => String(v));
  const quantities = formData.getAll("quantity").map((v) => Number(v));
  const lines: { variantId: string; quantity: number }[] = [];
  for (let i = 0; i < variantIds.length; i++) {
    const variantId = variantIds[i];
    const quantity = Math.round(quantities[i]);
    if (variantId && Number.isFinite(quantity) && quantity > 0) {
      lines.push({ variantId, quantity });
    }
  }
  if (lines.length === 0) {
    throw new Error("Đơn hàng cần ít nhất một sản phẩm.");
  }

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: lines.map((l) => l.variantId) } },
    select: { id: true, price: true },
  });
  const priceById = new Map(variants.map((v) => [v.id, v.price]));

  let subtotal = 0;
  const items = lines.map((l) => {
    const unitPrice = priceById.get(l.variantId);
    if (unitPrice == null) {
      throw new Error("Phiên bản sản phẩm không hợp lệ.");
    }
    subtotal += unitPrice * l.quantity;
    return {
      variant: { connect: { id: l.variantId } },
      quantity: l.quantity,
      unitPrice,
    };
  });
  const total = Math.max(0, subtotal + shippingCost - discount);

  const address = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    street: String(formData.get("street") ?? "").trim(),
    ward: String(formData.get("ward") ?? "").trim() || null,
    district: String(formData.get("district") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
  };
  if (
    !address.fullName ||
    !address.phone ||
    !address.street ||
    !address.district ||
    !address.city
  ) {
    throw new Error("Vui lòng nhập đầy đủ địa chỉ giao hàng.");
  }

  await prisma.order.create({
    data: {
      user: { connect: { id: userId } },
      status,
      note,
      subtotal,
      shippingCost,
      discount,
      total,
      address: { create: { ...address, user: { connect: { id: userId } } } },
      items: { create: items },
    },
  });

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

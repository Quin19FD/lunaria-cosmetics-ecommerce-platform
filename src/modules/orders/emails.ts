"use server";

import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mail";

import { buildOrderConfirmationEmail } from "./order-email";

/**
 * Loads the order, composes the confirmation email and sends it. Degrades
 * silently when the order or the customer's email address is missing.
 */
export async function sendOrderConfirmationEmail(
  orderId: string,
): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: { include: { product: { select: { name: true } } } },
        },
      },
      address: true,
      user: { select: { email: true, name: true } },
    },
  });

  if (!order || !order.user?.email || !order.address) {
    return;
  }

  const { subject, html, text } = buildOrderConfirmationEmail({
    id: order.id,
    customerName: order.user.name,
    total: order.total,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discount: order.discount,
    paymentMethod: order.paymentMethod,
    items: order.items.map((item) => ({
      name:
        item.variant.product.name +
        (item.variant.name ? ` - ${item.variant.name}` : ""),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    address: {
      fullName: order.address.fullName,
      phone: order.address.phone,
      street: order.address.street,
      ward: order.address.ward,
      district: order.address.district,
      city: order.address.city,
    },
  });

  await sendMail({ to: order.user.email, subject, html, text });
}

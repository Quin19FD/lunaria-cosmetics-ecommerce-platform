import type { Metadata } from "next";

import { CheckoutSuccess } from "@/features/checkout";
import type { CheckoutSuccessOrder } from "@/features/checkout";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { order: orderId } = await searchParams;

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: { include: { variant: { include: { product: true } } } },
          address: true,
        },
      })
    : null;

  const view: CheckoutSuccessOrder | null = order
    ? {
        id: order.id,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.variant.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      }
    : null;

  return <CheckoutSuccess order={view} />;
}

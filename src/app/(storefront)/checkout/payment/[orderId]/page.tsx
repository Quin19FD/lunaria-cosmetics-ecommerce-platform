import { notFound, redirect } from "next/navigation";

import { CardPaymentForm } from "@/features/checkout/components/card-payment-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/login");

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    select: { id: true, total: true, paymentMethod: true, paymentStatus: true },
  });
  if (!order) notFound();

  // Already paid or not a card order → go straight to the result page.
  if (order.paymentStatus === "PAID" || order.paymentMethod !== "CARD") {
    redirect(`/checkout/success?order=${order.id}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <CardPaymentForm orderId={order.id} total={order.total} />
    </div>
  );
}

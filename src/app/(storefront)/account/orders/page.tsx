import type { Metadata } from "next";

import { OrdersTable } from "@/features/account";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi",
};

export default function OrdersPage() {
  return <OrdersTable />;
}

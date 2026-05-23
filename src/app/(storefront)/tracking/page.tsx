import type { Metadata } from "next";

import { OrderTracking } from "@/features/checkout";

export const metadata: Metadata = {
  title: "Theo dõi đơn hàng",
};

export default function TrackingPage() {
  return <OrderTracking />;
}

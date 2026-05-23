import type { Metadata } from "next";
import { Suspense } from "react";

import { CheckoutSuccess } from "@/features/checkout";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      }
    >
      <CheckoutSuccess />
    </Suspense>
  );
}

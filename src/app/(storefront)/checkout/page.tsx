import type { Metadata } from "next";

import { CheckoutForm } from "@/features/checkout";

export const metadata: Metadata = {
  title: "Thanh toán",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
        Thanh toán
      </h1>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}

"use client";

import {
  CheckCircle,
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const ORDER_STEPS = [
  { icon: CheckCircle, label: "Đã xác nhận", active: true },
  { icon: CreditCard, label: "Đã thanh toán", active: true },
  { icon: Package, label: "Đang chuẩn bị", active: false },
  { icon: Truck, label: "Đang giao hàng", active: false },
  { icon: MapPin, label: "Đã giao", active: false },
];

export function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order") ?? "#LB-00000";
  const total = Number(searchParams.get("total") ?? 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      {/* Success icon */}
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold text-neutral-900">
          Đặt hàng thành công!
        </h1>
        <p className="mt-2 text-neutral-500">
          Cảm ơn bạn đã mua sắm tại Lunaria Beauty
        </p>
      </div>

      {/* Order info card */}
      <div className="mt-8 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-1 border-b border-neutral-100 pb-5 text-center">
          <p className="text-sm text-neutral-500">Mã đơn hàng</p>
          <p className="text-xl font-bold text-brand-500">{orderCode}</p>
          {total > 0 && (
            <p className="text-sm text-neutral-500">
              Tổng thanh toán:{" "}
              <span className="font-semibold text-neutral-900">
                {formatPrice(total)}
              </span>
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900">
            Trạng thái đơn hàng
          </h3>
          <div className="flex items-center justify-between">
            {ORDER_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      step.active
                        ? "bg-brand-500 text-white"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`mt-2 text-[10px] font-medium sm:text-xs ${
                      step.active ? "text-brand-500" : "text-neutral-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < ORDER_STEPS.length - 1 && (
                  <ChevronRight className="mx-1 h-4 w-4 text-neutral-300 sm:mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 rounded-xl bg-neutral-50 p-4">
          <p className="text-sm text-neutral-600">
            📧 Email xác nhận đã được gửi đến địa chỉ email của bạn.
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            📦 Đơn hàng sẽ được giao trong 2-5 ngày làm việc.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/account/orders">Theo dõi đơn hàng</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    </div>
  );
}

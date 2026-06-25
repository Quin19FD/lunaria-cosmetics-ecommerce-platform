import {
  CheckCircle,
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const ORDER_STEPS = [
  { icon: CheckCircle, label: "Đã xác nhận", active: true },
  { icon: CreditCard, label: "Đã thanh toán", active: true },
  { icon: Package, label: "Đang chuẩn bị", active: false },
  { icon: Truck, label: "Đang giao hàng", active: false },
  { icon: MapPin, label: "Đã giao", active: false },
];

export interface CheckoutSuccessOrder {
  id: string;
  total: number;
  paymentMethod: "COD" | "BANK" | "CARD";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  items: { id: string; name: string; quantity: number; unitPrice: number }[];
}

const PAYMENT_LABEL: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  BANK: "Chuyển khoản ngân hàng",
  CARD: "Thẻ tín dụng / ghi nợ",
};

interface CheckoutSuccessProps {
  order: CheckoutSuccessOrder | null;
}

export function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  const orderCode = order ? order.id.slice(0, 8).toUpperCase() : null;

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
        {order && (
          <div className="flex flex-col items-center gap-1 border-b border-neutral-100 pb-5 text-center">
            <p className="text-sm text-neutral-500">Mã đơn hàng</p>
            <p className="text-brand-500 text-xl font-bold">#{orderCode}</p>
            <p className="text-sm text-neutral-500">
              Tổng thanh toán:{" "}
              <span className="font-semibold text-neutral-900">
                {formatPrice(order.total)}
              </span>
            </p>
          </div>
        )}

        {order && (
          <div className="mt-6 space-y-2 border-b border-neutral-100 pb-6">
            <h3 className="text-sm font-semibold text-neutral-900">
              Thanh toán
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">
                {PAYMENT_LABEL[order.paymentMethod]}
              </span>
              <span
                className={
                  order.paymentStatus === "PAID"
                    ? "font-semibold text-emerald-600"
                    : "font-semibold text-amber-600"
                }
              >
                {order.paymentStatus === "PAID"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </span>
            </div>
            {order.paymentMethod === "BANK" &&
              order.paymentStatus !== "PAID" && (
                <div className="mt-2 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
                  <p>Vui lòng chuyển khoản theo thông tin sau:</p>
                  <p className="mt-1">
                    Ngân hàng: <strong>Vietcombank</strong> · STK:{" "}
                    <strong>0123456789</strong> · CTK:{" "}
                    <strong>LUNARIA BEAUTY</strong>
                  </p>
                  <p>
                    Nội dung: <strong>#{orderCode}</strong> · Số tiền:{" "}
                    <strong>{formatPrice(order.total)}</strong>
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Ordered items */}
        {order && order.items.length > 0 && (
          <div className="mt-6 space-y-3 border-b border-neutral-100 pb-6">
            <h3 className="text-sm font-semibold text-neutral-900">
              Sản phẩm đã đặt
            </h3>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-neutral-400">
                    SL: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-neutral-700">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

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

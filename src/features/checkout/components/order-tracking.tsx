"use client";

import {
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { productService } from "@/modules/products";

interface TrackingStep {
  icon: React.ElementType;
  label: string;
  time: string;
  done: boolean;
}

const MOCK_STEPS: TrackingStep[] = [
  { icon: CheckCircle, label: "Đơn hàng đã xác nhận", time: "12/10/2023 14:30", done: true },
  { icon: CreditCard, label: "Đã thanh toán", time: "12/10/2023 14:32", done: true },
  { icon: Package, label: "Đang chuẩn bị hàng", time: "13/10/2023 09:00", done: true },
  { icon: Truck, label: "Đang giao hàng", time: "14/10/2023 08:15", done: false },
  { icon: MapPin, label: "Đã giao thành công", time: "", done: false },
];

const MOCK_ITEMS = ["prod_01", "prod_03", "prod_05"];

export function OrderTracking() {
  const [orderCode, setOrderCode] = useState("");
  const [tracked, setTracked] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (orderCode.trim()) setTracked(true);
  }

  const products = MOCK_ITEMS.map((id) => productService.getById(id)).filter(
    (p): p is NonNullable<typeof p> => p != null,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center">
        <Package className="mx-auto h-10 w-10 text-brand-500" />
        <h1 className="mt-4 font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
          Theo dõi đơn hàng
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Nhập mã đơn hàng để kiểm tra trạng thái giao hàng
        </p>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mx-auto mt-8 flex max-w-md items-center gap-2"
      >
        <Input
          id="track-code"
          placeholder="Nhập mã đơn hàng (VD: #LB-98321)"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          required
          className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5"
        />
        <Button type="submit">Tra cứu</Button>
      </form>

      {/* Results */}
      {tracked && (
        <div className="mt-10 space-y-8">
          {/* Order info */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">Mã đơn hàng</p>
                <p className="text-lg font-bold text-brand-500">
                  {orderCode || "#LB-98321"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500">Tổng thanh toán</p>
                <p className="text-lg font-bold text-neutral-900">
                  {formatPrice(1250000)}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 space-y-0">
              {MOCK_STEPS.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === MOCK_STEPS.length - 1;
                return (
                  <div key={step.label} className="flex gap-4">
                    {/* Vertical line + icon */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                          step.done
                            ? "bg-brand-500 text-white"
                            : "bg-neutral-100 text-neutral-400",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {!isLast && (
                        <div
                          className={cn(
                            "w-0.5 flex-1",
                            step.done ? "bg-brand-500" : "bg-neutral-200",
                          )}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className={cn("pb-6", isLast && "pb-0")}>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          step.done ? "text-neutral-900" : "text-neutral-400",
                        )}
                      >
                        {step.label}
                      </p>
                      {step.time ? (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-400">
                          <Clock className="h-3 w-3" />
                          {step.time}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs text-neutral-400">
                          Đang chờ...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Products in order */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-neutral-900">
              Sản phẩm trong đơn hàng
            </h3>
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-neutral-400">SL: 1</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-500">
                    {formatPrice(p.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/account/orders">Xem tất cả đơn hàng</Link>
            </Button>
            <Button asChild>
              <Link href="/products">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

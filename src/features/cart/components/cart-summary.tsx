"use client";

import { ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

const SHIPPING_THRESHOLD = 500000;

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 30000;
  const total = subtotal + shippingFee;
  const freeShippingRemaining = SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-neutral-900">
        Tóm tắt đơn hàng
      </h2>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">
            Tạm tính ({itemCount} sản phẩm)
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Phí vận chuyển</span>
          <span className="font-medium">
            {shippingFee === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>

        {freeShippingRemaining > 0 && (
          <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-600">
            Mua thêm {formatPrice(freeShippingRemaining)} để được miễn phí vận
            chuyển
          </p>
        )}

        <div className="border-t border-neutral-200 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-neutral-900">Tổng cộng</span>
            <span className="text-lg font-bold text-brand-500">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      <Button asChild className="mt-6 w-full" size="lg">
        <Link href="/checkout">Tiến hành thanh toán</Link>
      </Button>

      <Button asChild variant="ghost" className="mt-2 w-full text-neutral-500">
        <Link href="/products">Tiếp tục mua sắm</Link>
      </Button>

      {/* Trust */}
      <div className="mt-6 space-y-2 border-t border-neutral-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Truck className="h-4 w-4 text-brand-500" />
          Miễn phí vận chuyển cho đơn từ 500k
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="h-4 w-4 text-brand-500" />
          Sản phẩm chính hãng 100%
        </div>
      </div>
    </div>
  );
}

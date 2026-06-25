"use client";

import type { OrderStatus } from "@prisma/client";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { formatDate, formatPrice, cn } from "@/lib/utils";
import { getMyOrders, type MyOrderRow } from "@/modules/orders/actions";

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Chờ xử lý", className: "bg-neutral-100 text-neutral-600" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-sky-100 text-sky-700" },
  PROCESSING: {
    label: "Đang xử lý",
    className: "bg-yellow-100 text-yellow-700",
  },
  SHIPPED: { label: "Đang giao", className: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "Hoàn thành", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Hoàn tiền", className: "bg-violet-100 text-violet-700" },
};

export function OrdersTable() {
  const [orders, setOrders] = useState<MyOrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getMyOrders()
      .then((rows) => {
        if (active) setOrders(rows);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-neutral-900" />
        <h2 className="font-serif text-xl font-bold text-neutral-900">
          Đơn hàng của tôi
        </h2>
      </div>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="border-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <p className="py-12 text-center text-sm text-neutral-500">
          Bạn chưa có đơn hàng nào.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                  Mã đơn
                </th>
                <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                  Ngày
                </th>
                <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                  Số SP
                </th>
                <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                  Trạng thái
                </th>
                <th className="pb-3 text-right text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                  Tổng
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                >
                  <td className="py-4">
                    <span className="text-sm font-semibold text-neutral-900">
                      {order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-neutral-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-neutral-700">
                      {order.itemCount}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        STATUS_MAP[order.status].className,
                      )}
                    >
                      {STATUS_MAP[order.status].label}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-brand-500 text-sm font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

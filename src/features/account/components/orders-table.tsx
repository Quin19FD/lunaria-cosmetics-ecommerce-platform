"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Pagination } from "@/features/products";
import { formatPrice, cn } from "@/lib/utils";
import { accountService, ORDER_STATUS_MAP } from "@/modules/account";

export function OrdersTable() {
  const [page, setPage] = useState(1);

  const ordersData = useMemo(() => {
    return accountService.getOrders(page);
  }, [page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-neutral-900" />
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Đơn hàng gần đây
          </h2>
        </div>
        <Link
          href="/account/orders"
          className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
        >
          Xem tất cả
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                Mã đơn
              </th>
              <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                Ngày đặt
              </th>
              <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                Tổng cộng
              </th>
              <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                Trạng thái
              </th>
              <th className="pb-3 text-left text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {ordersData.data.map((order, index) => (
              <tr
                key={order.id}
                className={cn(
                  "border-b border-neutral-100 py-4 transition-colors",
                  index % 2 === 0
                    ? "hover:bg-neutral-50"
                    : "hover:bg-neutral-50"
                )}
              >
                <td className="py-4">
                  <span className="text-sm font-semibold text-neutral-900">
                    {order.code}
                  </span>
                </td>
                <td className="py-4">
                  <span className="text-sm text-neutral-500">{order.date}</span>
                </td>
                <td className="py-4">
                  <span className="text-sm font-semibold text-brand-500">
                    {formatPrice(order.total)}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                      ORDER_STATUS_MAP[order.status].className
                    )}
                  >
                    {ORDER_STATUS_MAP[order.status].label}
                  </span>
                </td>
                <td className="py-4">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={ordersData.page}
        totalPages={ordersData.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

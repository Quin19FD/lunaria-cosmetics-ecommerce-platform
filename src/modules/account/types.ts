export type OrderStatus =
  | "delivered"
  | "shipping"
  | "processing"
  | "cancelled"
  | "pending";

export interface Order {
  id: string;
  code: string;
  date: string;
  total: number;
  status: OrderStatus;
}

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  delivered: {
    label: "Đã giao hàng",
    className: "bg-green-100 text-green-700",
  },
  shipping: { label: "Đang giao", className: "bg-blue-100 text-blue-700" },
  processing: {
    label: "Đang xử lý",
    className: "bg-yellow-100 text-yellow-700",
  },
  pending: {
    label: "Chờ xác nhận",
    className: "bg-neutral-100 text-neutral-600",
  },
  cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-700" },
};

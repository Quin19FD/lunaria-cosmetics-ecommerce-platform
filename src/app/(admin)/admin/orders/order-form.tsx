"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button, Input, Select, Textarea } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

interface UserOption {
  id: string;
  label: string;
}

interface VariantOption {
  id: string;
  label: string;
  price: number;
}

interface StatusOption {
  value: string;
  label: string;
}

interface OrderFormProps {
  users: UserOption[];
  variants: VariantOption[];
  statuses: StatusOption[];
  action: (formData: FormData) => Promise<void>;
}

interface LineItem {
  key: number;
  variantId: string;
  quantity: number;
}

export function OrderForm({
  users,
  variants,
  statuses,
  action,
}: OrderFormProps) {
  const priceById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of variants) map[v.id] = v.price;
    return map;
  }, [variants]);

  const [lines, setLines] = useState<LineItem[]>([
    { key: 0, variantId: "", quantity: 1 },
  ]);
  const [shipping, setShipping] = useState(30000);
  const [discount, setDiscount] = useState(0);

  const subtotal = lines.reduce(
    (sum, l) => sum + (priceById[l.variantId] ?? 0) * l.quantity,
    0,
  );
  const total = Math.max(0, subtotal + shipping - discount);

  function addLine() {
    setLines((prev) => [
      ...prev,
      { key: (prev.at(-1)?.key ?? 0) + 1, variantId: "", quantity: 1 },
    ]);
  }
  function removeLine(key: number) {
    setLines((prev) =>
      prev.length === 1 ? prev : prev.filter((l) => l.key !== key),
    );
  }
  function patchLine(key: number, patch: Partial<LineItem>) {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l)),
    );
  }

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Items */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-neutral-500 uppercase">
            Sản phẩm
          </h2>
          <div className="space-y-3">
            {lines.map((line) => (
              <div key={line.key} className="flex items-end gap-3">
                <div className="flex-1">
                  <Select
                    name="variantId"
                    value={line.variantId}
                    onChange={(e) =>
                      patchLine(line.key, { variantId: e.target.value })
                    }
                  >
                    <option value="">— Chọn sản phẩm —</option>
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="w-24">
                  <Input
                    name="quantity"
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) =>
                      patchLine(line.key, {
                        quantity: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                  />
                </div>
                <div className="w-28 pb-2 text-right text-sm text-neutral-600">
                  {formatPrice(
                    (priceById[line.variantId] ?? 0) * line.quantity,
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.key)}
                  className="mb-1 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label="Xóa dòng"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLine}
            className="mt-3"
          >
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </section>

        {/* Shipping address */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-neutral-500 uppercase">
            Địa chỉ giao hàng
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="fullName" label="Họ tên" required />
            <Input name="phone" label="Số điện thoại" required />
            <div className="sm:col-span-2">
              <Input name="street" label="Địa chỉ" required />
            </div>
            <Input name="ward" label="Phường/Xã" />
            <Input name="district" label="Quận/Huyện" required />
            <Input name="city" label="Tỉnh/Thành phố" required />
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <Textarea name="note" label="Ghi chú" placeholder="Ghi chú nội bộ…" />
        </section>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold tracking-wider text-neutral-500 uppercase">
            Thông tin đơn
          </h2>
          <Select name="userId" label="Khách hàng" required defaultValue="">
            <option value="" disabled>
              — Chọn khách hàng —
            </option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </Select>
          <Select name="status" label="Trạng thái" defaultValue="PENDING">
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </section>

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold tracking-wider text-neutral-500 uppercase">
            Thanh toán
          </h2>
          <Input
            name="shippingCost"
            label="Phí vận chuyển (₫)"
            type="number"
            min={0}
            value={shipping}
            onChange={(e) =>
              setShipping(Math.max(0, Number(e.target.value) || 0))
            }
          />
          <Input
            name="discount"
            label="Giảm giá (₫)"
            type="number"
            min={0}
            value={discount}
            onChange={(e) =>
              setDiscount(Math.max(0, Number(e.target.value) || 0))
            }
          />
          <div className="space-y-1.5 border-t border-neutral-100 pt-3 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Giảm giá</span>
              <span>-{formatPrice(discount)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-bold text-neutral-900">
              <span>Tổng cộng</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Tạo đơn hàng
          </Button>
        </section>
      </div>
    </form>
  );
}

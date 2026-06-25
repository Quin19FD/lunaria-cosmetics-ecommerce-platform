"use client";

import { useState } from "react";

import { Button, Input } from "@/components/ui";
import { DeleteButton } from "@/features/admin";
import { formatPrice } from "@/lib/utils";

export interface VariantRow {
  id: string;
  sku: string;
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  weight: number | null;
}

interface VariantManagerProps {
  productId: string;
  variants: VariantRow[];
  createAction: (productId: string, formData: FormData) => Promise<void>;
  updateAction: (
    productId: string,
    variantId: string,
    formData: FormData,
  ) => Promise<void>;
  deleteAction: (productId: string, variantId: string) => Promise<void>;
}

function VariantFields({ variant }: { variant?: VariantRow }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Input name="sku" label="SKU" defaultValue={variant?.sku} required />
      <Input name="name" label="Tên" defaultValue={variant?.name} required />
      <Input
        name="price"
        label="Giá (₫)"
        type="number"
        min={0}
        defaultValue={variant?.price}
        required
      />
      <Input
        name="salePrice"
        label="Giá KM (₫)"
        type="number"
        min={0}
        defaultValue={variant?.salePrice ?? ""}
      />
      <Input
        name="stock"
        label="Tồn kho"
        type="number"
        min={0}
        defaultValue={variant?.stock ?? 0}
      />
      <Input
        name="weight"
        label="Khối lượng (g)"
        type="number"
        min={0}
        defaultValue={variant?.weight ?? ""}
      />
    </div>
  );
}

export function VariantManager({
  productId,
  variants,
  createAction,
  updateAction,
  deleteAction,
}: VariantManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {variants.map((v) =>
        editingId === v.id ? (
          <form
            key={v.id}
            action={updateAction.bind(null, productId, v.id)}
            onSubmit={() => setEditingId(null)}
            className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
          >
            <VariantFields variant={v} />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingId(null)}
              >
                Hủy
              </Button>
              <Button type="submit" size="sm">
                Lưu
              </Button>
            </div>
          </form>
        ) : (
          <div
            key={v.id}
            className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-neutral-900">
                {v.name}{" "}
                <span className="text-xs text-neutral-400">({v.sku})</span>
              </p>
              <p className="mt-0.5 text-sm text-neutral-500">
                {formatPrice(v.price)}
                {v.salePrice != null && ` · KM ${formatPrice(v.salePrice)}`} ·
                Tồn {v.stock}
                {v.weight != null && ` · ${v.weight}g`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingId(v.id)}
              >
                Sửa
              </Button>
              <DeleteButton
                action={deleteAction.bind(null, productId, v.id)}
                confirmMessage="Xóa phiên bản này?"
              />
            </div>
          </div>
        ),
      )}

      <form
        key={variants.length}
        action={createAction.bind(null, productId)}
        className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4"
      >
        <p className="text-sm font-semibold text-neutral-700">
          Thêm phiên bản mới
        </p>
        <VariantFields />
        <div className="flex justify-end">
          <Button type="submit" size="sm" variant="outline">
            Thêm phiên bản
          </Button>
        </div>
      </form>
    </div>
  );
}

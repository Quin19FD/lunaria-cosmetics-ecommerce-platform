"use client";

import { Button, Input } from "@/components/ui";
import { DeleteButton } from "@/features/admin";

export interface ImageRow {
  id: string;
  url: string;
  alt: string | null;
  position: number;
}

interface ImageManagerProps {
  productId: string;
  images: ImageRow[];
  createAction: (productId: string, formData: FormData) => Promise<void>;
  deleteAction: (productId: string, imageId: string) => Promise<void>;
}

export function ImageManager({
  productId,
  images,
  createAction,
  deleteAction,
}: ImageManagerProps) {
  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="aspect-square w-full object-cover"
              />
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs text-neutral-400">
                  #{img.position}
                </span>
                <DeleteButton
                  action={deleteAction.bind(null, productId, img.id)}
                  confirmMessage="Xóa ảnh này?"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        key={images.length}
        action={createAction.bind(null, productId)}
        className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4"
      >
        <p className="text-sm font-semibold text-neutral-700">Thêm ảnh</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Input
              name="url"
              label="URL ảnh"
              type="url"
              placeholder="https://…"
              required
            />
          </div>
          <Input
            name="position"
            label="Thứ tự"
            type="number"
            min={0}
            defaultValue={0}
          />
          <div className="sm:col-span-3">
            <Input name="alt" label="Mô tả (alt)" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" variant="outline">
            Thêm ảnh
          </Button>
        </div>
      </form>
    </div>
  );
}

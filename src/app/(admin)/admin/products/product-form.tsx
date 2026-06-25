"use client";

import { Button, Input, Select, Textarea } from "@/components/ui";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    description?: string | null;
    ingredients?: string | null;
    howToUse?: string | null;
    categoryId?: string;
    brandId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  };
  submitLabel: string;
}

export function ProductForm({
  categories,
  brands,
  action,
  defaultValues,
  submitLabel,
}: ProductFormProps) {
  const isActive = defaultValues?.isActive ?? true;
  const isFeatured = defaultValues?.isFeatured ?? false;

  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6"
    >
      <Input
        id="name"
        name="name"
        label="Tên sản phẩm"
        required
        defaultValue={defaultValues?.name ?? ""}
        placeholder="Nhập tên sản phẩm"
      />

      <Textarea
        id="description"
        name="description"
        label="Mô tả"
        defaultValue={defaultValues?.description ?? ""}
        placeholder="Mô tả sản phẩm"
      />

      <Textarea
        id="ingredients"
        name="ingredients"
        label="Thành phần"
        defaultValue={defaultValues?.ingredients ?? ""}
        placeholder="Thành phần sản phẩm"
      />

      <Textarea
        id="howToUse"
        name="howToUse"
        label="Cách dùng"
        defaultValue={defaultValues?.howToUse ?? ""}
        placeholder="Hướng dẫn sử dụng"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Select
          id="categoryId"
          name="categoryId"
          label="Danh mục"
          required
          defaultValue={defaultValues?.categoryId ?? ""}
        >
          <option value="" disabled>
            Chọn danh mục
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <Select
          id="brandId"
          name="brandId"
          label="Thương hiệu"
          required
          defaultValue={defaultValues?.brandId ?? ""}
        >
          <option value="" disabled>
            Chọn thương hiệu
          </option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="isActive"
            value="on"
            defaultChecked={isActive}
            className="text-brand-500 focus:ring-brand-500/40 h-4 w-4 rounded border-neutral-300"
          />
          Hiển thị sản phẩm
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="isFeatured"
            value="on"
            defaultChecked={isFeatured}
            className="text-brand-500 focus:ring-brand-500/40 h-4 w-4 rounded border-neutral-300"
          />
          Sản phẩm nổi bật
        </label>
      </div>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

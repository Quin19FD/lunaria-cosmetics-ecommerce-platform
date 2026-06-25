"use client";

import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
  type UserAddress,
} from "@/modules/account/address.actions";

interface AddressFormState {
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddressFormState = {
  fullName: "",
  phone: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  isDefault: false,
};

function formatAddressLine(address: UserAddress): string {
  return [address.street, address.ward, address.district, address.city]
    .filter(Boolean)
    .join(", ");
}

export function AddressManager({
  initialAddresses,
}: {
  initialAddresses: UserAddress[];
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setActionError(null);
    setEditingId(null);
    setCreating(true);
  }

  function openEdit(address: UserAddress) {
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      ward: address.ward ?? "",
      district: address.district,
      city: address.city,
      isDefault: address.isDefault,
    });
    setFormError(null);
    setActionError(null);
    setCreating(false);
    setEditingId(address.id);
  }

  function closeForm() {
    setCreating(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setBusy(true);
    const result = editingId
      ? await updateAddress(editingId, form)
      : await createAddress(form);
    setBusy(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    closeForm();
    router.refresh();
  }

  async function handleSetDefault(id: string) {
    setActionError(null);
    setBusy(true);
    const result = await setDefaultAddress(id);
    setBusy(false);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    setActionError(null);
    setBusy(true);
    const result = await deleteAddress(id);
    setBusy(false);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    router.refresh();
  }

  const formNode = (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
    >
      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{formError}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Họ tên người nhận"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="Nguyễn Văn A"
          disabled={busy}
        />
        <Input
          label="Số điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="09xx xxx xxx"
          disabled={busy}
        />
      </div>
      <Input
        label="Địa chỉ (số nhà, tên đường)"
        value={form.street}
        onChange={(e) => setForm({ ...form, street: e.target.value })}
        placeholder="123 Lê Lợi"
        disabled={busy}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Phường/Xã"
          value={form.ward}
          onChange={(e) => setForm({ ...form, ward: e.target.value })}
          placeholder="Không bắt buộc"
          disabled={busy}
        />
        <Input
          label="Quận/Huyện"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          placeholder="Quận 1"
          disabled={busy}
        />
        <Input
          label="Tỉnh/Thành phố"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          placeholder="TP. Hồ Chí Minh"
          disabled={busy}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          className="accent-brand-500 h-4 w-4 rounded"
          disabled={busy}
        />
        Đặt làm mặc định
      </label>
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu địa chỉ"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={closeForm}
          disabled={busy}
        >
          Hủy
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Sổ địa chỉ
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Quản lý địa chỉ giao hàng của bạn
          </p>
        </div>
        {!creating && !editingId && (
          <Button type="button" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Thêm địa chỉ
          </Button>
        )}
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{actionError}</p>
        </div>
      )}

      {creating && formNode}

      {initialAddresses.length === 0 && !creating ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
          <MapPin className="mx-auto h-8 w-8 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">
            Bạn chưa có địa chỉ nào.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {initialAddresses.map((address) =>
            editingId === address.id ? (
              <div key={address.id}>{formNode}</div>
            ) : (
              <div
                key={address.id}
                className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900">
                      {address.fullName}
                    </p>
                    {address.isDefault && (
                      <Badge variant="brand">Mặc định</Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">{address.phone}</p>
                  <p className="text-sm text-neutral-600">
                    {formatAddressLine(address)}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(address)}
                    disabled={busy}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Sửa
                  </Button>
                  {!address.isDefault && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={busy}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    disabled={busy}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Xóa
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { CreditCard, Landmark, Truck, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import {
  listAddresses,
  type UserAddress,
} from "@/modules/account/address.actions";
import { getCartItems, type CartLine } from "@/modules/cart/actions";
import { placeOrder } from "@/modules/orders/actions";
import { useCartStore } from "@/store/use-cart-store";

const PAYMENT_METHODS = [
  { id: "cod", label: "Thanh toán khi nhận hàng", icon: Wallet },
  { id: "bank", label: "Chuyển khoản ngân hàng", icon: Landmark },
  { id: "card", label: "Thẻ tín dụng / ghi nợ", icon: CreditCard },
];

const SHIPPING_THRESHOLD = 500000;

export function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("TP. Hồ Chí Minh");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const ids = useMemo(() => items.map((i) => i.variantId), [items]);

  useEffect(() => {
    if (ids.length === 0) {
      setLines([]);
      setProductsLoading(false);
      return;
    }
    let active = true;
    setProductsLoading(true);
    getCartItems(ids).then((result) => {
      if (!active) return;
      setLines(result);
      setProductsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [ids]);

  useEffect(() => {
    if (!session?.user) return;
    let active = true;
    listAddresses().then((result) => {
      if (!active) return;
      setAddresses(result);
      const def = result.find((a) => a.isDefault) ?? result[0];
      if (def) setSelectedAddressId(def.id);
    });
    return () => {
      active = false;
    };
  }, [session?.user]);

  const cartLines = useMemo(() => {
    const byVariant = new Map(lines.map((l) => [l.variantId, l]));
    return items
      .map((item) => {
        const line = byVariant.get(item.variantId);
        return line ? { line, quantity: item.quantity } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x != null);
  }, [lines, items]);

  const subtotal = cartLines.reduce(
    (sum, { line, quantity }) =>
      sum + (line.salePrice ?? line.price) * quantity,
    0,
  );
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 30000;
  const total = subtotal + shippingFee;
  const totalItems = cartLines.reduce((s, { quantity }) => s + quantity, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      router.push("/auth/login?callback=/checkout");
      return;
    }

    setError("");
    setIsLoading(true);

    const useSaved = selectedAddressId !== "";
    const paymentMethod =
      payment === "card" ? "CARD" : payment === "bank" ? "BANK" : "COD";

    const result = await placeOrder({
      items: items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      addressId: useSaved ? selectedAddressId : undefined,
      fullName,
      phone,
      street,
      district,
      city,
      note,
      paymentMethod,
    });

    if (result.ok) {
      clearCart();
      if (paymentMethod === "CARD") {
        router.push(`/checkout/payment/${result.orderId}`);
      } else {
        router.push(`/checkout/success?order=${result.orderId}`);
      }
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  }

  if (productsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (cartLines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-500">
          Giỏ hàng trống, không thể thanh toán.
        </p>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Left — Shipping + Payment */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* Shipping info */}
          <section className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Truck className="text-brand-500 h-5 w-5" />
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                Thông tin giao hàng
              </h2>
            </div>
            <div className="space-y-4">
              {addresses.length > 0 && (
                <div className="space-y-2">
                  {addresses.map((a) => (
                    <label
                      key={a.id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-xl border p-3",
                        selectedAddressId === a.id
                          ? "border-brand-500 bg-brand-50"
                          : "border-neutral-200",
                      )}
                    >
                      <input
                        type="radio"
                        name="addr"
                        checked={selectedAddressId === a.id}
                        onChange={() => setSelectedAddressId(a.id)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-neutral-900">
                          {a.fullName} · {a.phone}
                          {a.isDefault && " (Mặc định)"}
                        </p>
                        <p className="text-neutral-500">
                          {[a.street, a.ward, a.district, a.city]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </label>
                  ))}
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3",
                      selectedAddressId === ""
                        ? "border-brand-500 bg-brand-50"
                        : "border-neutral-200",
                    )}
                  >
                    <input
                      type="radio"
                      name="addr"
                      checked={selectedAddressId === ""}
                      onChange={() => setSelectedAddressId("")}
                    />
                    <span className="text-sm font-medium text-neutral-900">
                      Nhập địa chỉ mới
                    </span>
                  </label>
                </div>
              )}
              {selectedAddressId === "" && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      id="checkout-name"
                      label="Họ và tên"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    <Input
                      id="checkout-phone"
                      label="Số điện thoại"
                      type="tel"
                      placeholder="0901 234 567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    id="checkout-email"
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    id="checkout-street"
                    label="Địa chỉ"
                    placeholder="Số nhà, tên đường"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      id="checkout-district"
                      label="Quận / Huyện"
                      placeholder="Quận Bình Tân"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    />
                    <Input
                      id="checkout-city"
                      label="Tỉnh / Thành phố"
                      placeholder="TP. Hồ Chí Minh"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-note"
                  className="text-[11px] font-semibold tracking-widest text-neutral-400 uppercase"
                >
                  Ghi chú đơn hàng
                </label>
                <textarea
                  id="checkout-note"
                  rows={3}
                  placeholder="Ghi chú cho người giao hàng (không bắt buộc)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:ring-1 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <CreditCard className="text-brand-500 h-5 w-5" />
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                Phương thức thanh toán
              </h2>
            </div>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors",
                    payment === m.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-neutral-200 hover:border-neutral-300",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      payment === m.id
                        ? "border-brand-500"
                        : "border-neutral-300",
                    )}
                  >
                    {payment === m.id && (
                      <div className="bg-brand-500 h-2.5 w-2.5 rounded-full" />
                    )}
                  </div>
                  <m.icon className="h-5 w-5 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">
                    {m.label}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right — Order summary */}
        <div className="w-full flex-shrink-0 lg:w-80">
          <div className="sticky top-24 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-neutral-900">
              Đơn hàng của bạn
            </h2>

            {/* Items */}
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {cartLines.map(({ line, quantity }) => (
                <div key={line.variantId} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <img
                      src={line.image}
                      alt={line.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {line.productName}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {line.variantName} · SL: {quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">
                    {formatPrice((line.salePrice ?? line.price) * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">
                  Tạm tính ({totalItems} sản phẩm)
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Phí vận chuyển</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-3">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-brand-500 text-lg font-bold">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

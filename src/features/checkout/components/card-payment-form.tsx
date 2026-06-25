"use client";

import { CreditCard, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { payOrder } from "@/modules/orders/payment.actions";

interface CardPaymentFormProps {
  orderId: string;
  total: number;
}

export function CardPaymentForm({ orderId, total }: CardPaymentFormProps) {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const digits = number.replace(/\s/g, "");
    if (digits.length < 12 || !/^\d+$/.test(digits)) {
      setError("Số thẻ không hợp lệ.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Hạn thẻ không hợp lệ (MM/YY).");
      return;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setError("CVC không hợp lệ.");
      return;
    }

    setLoading(true);
    const result = await payOrder(orderId);
    if (result.ok) {
      router.push(`/checkout/success?order=${orderId}`);
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-5 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <CreditCard className="text-brand-500 h-5 w-5" />
        <h2 className="font-serif text-lg font-bold text-neutral-900">
          Thanh toán bằng thẻ
        </h2>
      </div>

      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
        Cổng thanh toán mô phỏng cho mục đích demo — không xử lý thẻ thật. Nhập
        số thẻ bất kỳ để hoàn tất.
      </p>

      <Input
        label="Số thẻ"
        placeholder="4242 4242 4242 4242"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        inputMode="numeric"
        required
      />
      <Input
        label="Tên trên thẻ"
        placeholder="NGUYEN VAN A"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hạn (MM/YY)"
          placeholder="12/28"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          required
        />
        <Input
          label="CVC"
          placeholder="123"
          value={cvc}
          onChange={(e) => setCvc(e.target.value)}
          inputMode="numeric"
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        <Lock className="h-4 w-4" />
        {loading ? "Đang xử lý..." : `Thanh toán ${formatPrice(total)}`}
      </Button>
    </form>
  );
}

"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Lock } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { createPaymentIntent } from "@/modules/orders/payment.actions";

const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = pubKey ? loadStripe(pubKey) : null;

interface CardPaymentFormProps {
  orderId: string;
  total: number;
}

/**
 * Renders the Stripe PaymentElement and confirms payment. On success Stripe
 * redirects to the return URL, so we only handle the error branch here.
 */
function PaymentInner({ orderId, total }: CardPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError("");
    setLoading(true);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
      },
    });

    if (confirmError) {
      setError(
        confirmError.message ?? "Thanh toán thất bại. Vui lòng thử lại.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading || !stripe || !elements}
      >
        <Lock className="h-4 w-4" />
        {loading ? "Đang xử lý..." : `Thanh toán ${formatPrice(total)}`}
      </Button>
    </form>
  );
}

export function CardPaymentForm({ orderId, total }: CardPaymentFormProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pubKey) return;

    let active = true;
    createPaymentIntent(orderId).then((result) => {
      if (!active) return;
      if (result.ok) setClientSecret(result.clientSecret);
      else setError(result.error);
    });

    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <div className="mx-auto max-w-md space-y-5 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <CreditCard className="text-brand-500 h-5 w-5" />
        <h2 className="font-serif text-lg font-bold text-neutral-900">
          Thanh toán bằng thẻ
        </h2>
      </div>

      {!pubKey ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Thanh toán thẻ chưa được cấu hình.
        </p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : !clientSecret ? (
        <p className="text-sm text-neutral-500">Đang tải cổng thanh toán...</p>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, locale: "vi" }}
        >
          <PaymentInner orderId={orderId} total={total} />
        </Elements>
      )}
    </div>
  );
}

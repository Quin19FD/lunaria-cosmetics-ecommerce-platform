"use client";

import { useEffect, useMemo, useState } from "react";

import { CartItemRow, CartSummary, EmptyCart } from "@/features/cart";
import { useMounted } from "@/hooks/use-mounted";
import { getCartProducts } from "@/modules/cart/actions";
import type { Product } from "@/modules/products";
import { useCartStore } from "@/store/use-cart-store";

export default function CartPage() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const ids = useMemo(() => items.map((i) => i.productId), [items]);

  useEffect(() => {
    if (!mounted) return;
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    getCartProducts(ids).then((result) => {
      if (!active) return;
      setProducts(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [mounted, ids]);

  const cartProducts = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return items
      .map((item) => {
        const product = byId.get(item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x != null);
  }, [products, items]);

  const subtotal = cartProducts.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );

  const totalItems = cartProducts.reduce(
    (sum, { quantity }) => sum + quantity,
    0,
  );

  if (!mounted || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
        Giỏ hàng
      </h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Cart items */}
        <div className="min-w-0 flex-1 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
          {cartProducts.map(({ product, quantity }) => (
            <CartItemRow
              key={product.id}
              product={product}
              quantity={quantity}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="w-full flex-shrink-0 lg:w-80">
          <CartSummary subtotal={subtotal} itemCount={totalItems} />
        </div>
      </div>
    </div>
  );
}

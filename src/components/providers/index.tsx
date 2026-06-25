"use client";

import { MotionConfig } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

import { CartSync } from "@/features/cart/cart-sync";
import { WishlistSync } from "@/features/wishlist/wishlist-sync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartSync />
      <WishlistSync />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SessionProvider>
  );
}

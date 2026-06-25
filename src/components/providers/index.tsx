"use client";

import { MotionConfig } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

import { CartSync } from "@/features/cart/cart-sync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartSync />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SessionProvider>
  );
}

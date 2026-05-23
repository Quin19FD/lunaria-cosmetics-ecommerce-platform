import type { ReactNode } from "react";

import { BrandLogo, DecorativeImages } from "@/features/auth";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100/50 px-4">
      {/* Subtle radial accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(239,57,133,0.08), transparent)",
        }}
      />

      {/* Logo */}
      <div className="relative z-20 mb-8">
        <BrandLogo />
      </div>

      {/* Main content with decorative images */}
      <div className="relative flex w-full items-center justify-center">
        <DecorativeImages />
        {children}
      </div>
    </div>
  );
}

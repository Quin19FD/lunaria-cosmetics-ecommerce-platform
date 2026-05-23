import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "relative z-10 w-full max-w-[440px] rounded-2xl bg-white/80 px-8 py-10 shadow-xl shadow-brand-500/5 backdrop-blur-sm sm:px-12 sm:py-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

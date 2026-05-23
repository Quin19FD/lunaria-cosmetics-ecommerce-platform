"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { AccountSidebar } from "@/features/account";
import { useMounted } from "@/hooks/use-mounted";
import { useAuthStore } from "@/store/use-auth-store";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (mounted && !user) {
      router.replace("/auth/login");
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Sidebar */}
        <aside className="w-full flex-shrink-0 lg:w-60">
          <AccountSidebar />
        </aside>

        {/* Content — white card */}
        <main className="min-w-0 flex-1 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

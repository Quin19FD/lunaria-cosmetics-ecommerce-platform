"use client";

import { Lock, LogOut, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { accountService } from "@/modules/account";
import { useAuthStore } from "@/store/use-auth-store";

const NAV_ITEMS = [
  { label: "Thông tin cá nhân", href: "/account/profile", icon: User },
  { label: "Đơn hàng của tôi", href: "/account/orders", icon: ShoppingBag },
  { label: "Đổi mật khẩu", href: "/account/change-password", icon: Lock },
];

export function AccountSidebar() {
  const mounted = useMounted();
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loyalty = useMemo(() => accountService.getLoyaltyPoints(), []);

  if (!mounted || !user) return null;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const progress =
    (loyalty.points / (loyalty.points + loyalty.remaining)) * 100;

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <div className="space-y-6">
      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-brand-100">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className="h-12 w-12 object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center text-sm font-bold text-brand-500">
              {initials}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{user.name}</p>
          <p className="text-[11px] font-semibold tracking-wider text-brand-500 uppercase">
            Thành viên hạng vàng
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-500 text-white"
                  : "text-neutral-600 hover:bg-neutral-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout — separated */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-brand-500 transition-colors hover:text-brand-600"
      >
        <LogOut className="h-4 w-4" />
        Đăng xuất
      </button>

      {/* Loyalty card */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 p-5 text-white">
        <p className="text-[10px] font-semibold tracking-widest uppercase opacity-80">
          Điểm tích lũy
        </p>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold">
            {loyalty.points.toLocaleString()}
          </span>
          <span className="text-sm opacity-80">L-Points</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] opacity-80">
          Còn {loyalty.remaining.toLocaleString()} điểm để lên hạng{" "}
          {loyalty.nextTier}
        </p>
      </div>
    </div>
  );
}

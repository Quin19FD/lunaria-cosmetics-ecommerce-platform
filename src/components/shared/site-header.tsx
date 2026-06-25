"use client";

import { LogOut, Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useCartStore } from "@/store/use-cart-store";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Khuyến mãi", href: "/promotions" },
  { label: "Liên hệ", href: "/contact" },
  { label: "Bộ sưu tập", href: "/collections" },
];

export function SiteHeader() {
  const mounted = useMounted();
  const { data: session } = useSession();
  const user = session?.user;
  const cartCount = useCartStore((s) => s.totalItems());
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  function handleLogout() {
    setShowUserMenu(false);
    void signOut({ callbackUrl: "/auth/login" });
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  // Derive initials from user name
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center gap-2">
          <svg
            className="text-brand-500 h-7 w-7"
            viewBox="0 0 28 28"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14 0L15.8 10.2L26 14L15.8 17.8L14 28L12.2 17.8L2 14L12.2 10.2L14 0Z" />
          </svg>
          <span className="text-brand-500 hidden font-serif text-lg font-bold sm:inline">
            LUNARIA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-brand-500 text-sm font-medium text-neutral-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 md:flex"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              aria-label="Tìm kiếm"
              className="w-32 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
            />
            <button type="submit" aria-label="Tìm kiếm">
              <Search className="h-4 w-4 text-neutral-500" />
            </button>
          </form>

          {/* Search icon — mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Tìm kiếm"
            onClick={() => router.push("/search")}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Giỏ hàng">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            {mounted && cartCount > 0 && (
              <span className="bg-brand-500 absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth area */}
          {mounted && user ? (
            /* Logged-in: avatar + dropdown */
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((v) => !v)}
                className="focus:ring-brand-500/40 flex items-center gap-2 rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none"
                aria-label="Menu tài khoản"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? ""}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="bg-brand-500 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
                    {initials}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-neutral-100 px-4 pt-2 pb-3">
                    <p className="text-sm font-semibold text-neutral-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-neutral-400">{user.email}</p>
                  </div>
                  <Link
                    href="/account/orders"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Đơn hàng của tôi
                  </Link>
                  <Link
                    href="/account/profile"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    href="/account/change-password"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <div className="border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-red-500"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : mounted ? (
            <Link
              href="/auth/login"
              className="bg-brand-500 hover:bg-brand-600 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              Đăng nhập
            </Link>
          ) : (
            /* SSR placeholder */
            <div className="h-8 w-8 rounded-full bg-neutral-200" />
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Mở menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="border-b border-neutral-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {/* Search — mobile menu */}
            <form
              onSubmit={handleSearch}
              className="mb-2 flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm"
                className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
              />
              <button type="submit" aria-label="Tìm kiếm">
                <Search className="h-4 w-4 text-neutral-500" />
              </button>
            </form>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-brand-500 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {mounted && !user && (
              <Link
                href="/auth/login"
                className="bg-brand-500 mt-2 rounded-lg px-3 py-2.5 text-center text-sm font-medium text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
            {mounted && user && (
              <>
                <div className="mt-2 border-t border-neutral-200 pt-2">
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đơn hàng của tôi
                  </Link>
                  <Link
                    href="/account/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    href="/account/change-password"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

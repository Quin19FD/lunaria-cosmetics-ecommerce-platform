"use client";

import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface AdminHeaderProps {
  name: string | null;
  email: string;
  role: string;
}

export function AdminHeader({ name, email, role }: AdminHeaderProps) {
  const [open, setOpen] = useState(false);

  const initials = (name ?? email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <Link
        href="/"
        className="hover:text-brand-500 flex items-center gap-1.5 text-sm text-neutral-500 transition-colors"
      >
        <ExternalLink className="h-4 w-4" />
        Xem cửa hàng
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-full focus:outline-none"
        >
          <span className="bg-brand-500 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-neutral-900">
              {name ?? email}
            </span>
            <span className="text-brand-500 block text-[11px] font-medium tracking-wider uppercase">
              {role}
            </span>
          </span>
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 w-56 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
            <div className="border-b border-neutral-100 px-4 pt-2 pb-2.5">
              <p className="text-sm font-semibold text-neutral-900">
                {name ?? "—"}
              </p>
              <p className="text-xs text-neutral-400">{email}</p>
            </div>
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/auth/login" })}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

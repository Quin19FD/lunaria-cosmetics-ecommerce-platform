"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Tag,
  Users,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Bán hàng",
    items: [{ label: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart }],
  },
  {
    title: "Sản phẩm",
    items: [
      { label: "Sản phẩm", href: "/admin/products", icon: Package },
      { label: "Danh mục", href: "/admin/categories", icon: FolderTree },
      { label: "Thương hiệu", href: "/admin/brands", icon: Tag },
    ],
  },
  {
    title: "Khách hàng",
    items: [
      { label: "Người dùng", href: "/admin/users", icon: Users },
      { label: "Đánh giá", href: "/admin/reviews", icon: Star },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-6">
        <span className="text-brand-500 font-serif text-xl font-bold">
          Lunaria
        </span>
        <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
          </div>
        ))}
      </nav>
    </aside>
  );
}

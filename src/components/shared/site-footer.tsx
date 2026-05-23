import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
];

const ABOUT_LINKS = [
  { label: "Câu chuyện thương hiệu", href: "/about" },
  { label: "Triết lý làm đẹp", href: "/about" },
  { label: "Hệ thống cửa hàng", href: "/contact" },
  { label: "Tin tức & Blog", href: "/collections" },
  { label: "Tuyển dụng", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Chính sách bảo mật", href: "/privacy" },
  { label: "Điều khoản dịch vụ", href: "/terms" },
  { label: "Chính sách vận chuyển", href: "/shipping" },
  { label: "Chính sách đổi trả", href: "/returns" },
  { label: "Câu hỏi thường gặp", href: "/faq" },
];

export function SiteFooter() {
  return (
    <footer className="bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-serif text-2xl font-bold text-brand-500">
              LUNARIA
            </Link>
            <p className="text-sm leading-relaxed text-neutral-600">
              LUNARIA BEAUTY cam kết mang đến những sản phẩm làm đẹp từ thiên
              nhiên, an toàn và hiệu quả, giúp phụ nữ Việt tự tin tỏa sáng rạng ngời.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 transition-colors hover:bg-brand-500 hover:text-white",
                  )}
                  aria-label={s.label}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Về Lunaria */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-neutral-900">Về Lunaria</h3>
            <nav className="flex flex-col gap-2">
              {ABOUT_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="text-sm text-neutral-600 transition-colors hover:text-brand-500">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Hỗ Trợ Khách Hàng */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-neutral-900">Hỗ Trợ Khách Hàng</h3>
            <nav className="flex flex-col gap-2">
              {SUPPORT_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="text-sm text-neutral-600 transition-colors hover:text-brand-500">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Liên Hệ */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-neutral-900">Liên Hệ</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 text-sm text-neutral-600">
                <MapPin className="h-5 w-5 flex-shrink-0 text-brand-500" />
                <span>123 Đường Tiên Lụa, Quận Bình Tân, TP. Hồ Chí Minh</span>
              </div>
              <a href="tel:19001234" className="flex gap-3 text-sm text-neutral-600 transition-colors hover:text-brand-500">
                <Phone className="h-5 w-5 flex-shrink-0 text-brand-500" />
                <span>1900 1234 (8:00 - 21:00)</span>
              </a>
              <a href="mailto:contact@lunaria.beauty" className="flex gap-3 text-sm text-neutral-600 transition-colors hover:text-brand-500">
                <Mail className="h-5 w-5 flex-shrink-0 text-brand-500" />
                <span>contact@lunaria.beauty</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-neutral-500">
            © 2024 LUNARIA BEAUTY. All Rights Reserved. Designed with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}

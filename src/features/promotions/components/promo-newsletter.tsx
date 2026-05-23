"use client";

import { Bell, CheckCircle } from "lucide-react";
import { useState } from "react";

export function PromoNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  }

  return (
    <section className="mx-4 mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-white sm:mx-6 lg:mx-auto lg:max-w-4xl">
      <div className="border border-brand-100 rounded-2xl px-6 py-12 text-center sm:px-12 lg:py-14">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
          <Bell className="h-5 w-5 text-brand-500" />
        </div>

        <h2 className="mt-5 font-serif text-xl font-bold text-neutral-900 sm:text-2xl">
          Không Bỏ Lỡ Ưu Đãi Nào
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
          Đăng ký nhận thông báo khuyến mãi sớm nhất và mã giảm giá độc quyền
          dành riêng cho thành viên.
        </p>

        {subscribed ? (
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2.5 ring-1 ring-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Đăng ký thành công!
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md items-center rounded-full bg-white p-1 ring-1 ring-neutral-200"
          >
            <input
              type="email"
              required
              placeholder="Địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-500 px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand-600"
            >
              Đăng ký
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

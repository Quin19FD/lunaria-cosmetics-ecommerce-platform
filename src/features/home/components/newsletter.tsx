"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit - just prevent default
  };

  return (
    <section className="from-brand-500 to-brand-400 rounded-3xl bg-gradient-to-r">
      <div className="mx-4 max-w-5xl px-8 py-12 sm:mx-6 lg:mx-auto">
        {/* Heading */}
        <h2 className="text-center font-serif text-2xl font-bold text-white sm:text-3xl">
          Đăng Ký Nhận Bản Tin
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-center text-sm text-white/80 sm:text-base">
          Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên và cập nhật những bí
          quyết làm đẹp mới nhất.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md">
          <div className="flex w-full items-center rounded-full bg-white p-1.5 sm:p-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Địa chỉ email của bạn"
              className="flex-1 bg-transparent px-4 text-sm outline-none"
              required
            />
            <Button
              type="submit"
              className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Đăng ký ngay
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

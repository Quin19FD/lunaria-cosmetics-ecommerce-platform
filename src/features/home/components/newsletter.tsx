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
    <section className="bg-gradient-to-r from-brand-500 to-brand-400 rounded-3xl">
      <div className="mx-4 sm:mx-6 lg:mx-auto max-w-5xl py-12 px-8">
        {/* Heading */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white text-center">
          Đăng Ký Nhận Bản Tin
        </h2>

        {/* Subtitle */}
        <p className="text-white/80 text-center mt-3 text-sm sm:text-base">
          Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên và cập nhật những bí
          quyết làm đẹp mới nhất.
        </p>

        {/* Email Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex max-w-md mx-auto"
        >
          <div className="w-full bg-white rounded-full flex items-center p-1.5 sm:p-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Địa chỉ email của bạn"
              className="flex-1 bg-transparent px-4 outline-none text-sm"
              required
            />
            <Button
              type="submit"
              className="bg-neutral-900 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-neutral-800"
            >
              Đăng ký ngay
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

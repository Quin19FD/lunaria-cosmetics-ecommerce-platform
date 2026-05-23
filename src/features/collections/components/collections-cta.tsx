"use client";

import { useState } from "react";

export function CollectionsCta() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmail("");
  }

  return (
    <section className="mx-4 mb-12 rounded-3xl bg-neutral-900 px-6 py-16 text-center sm:mx-6 sm:px-12 lg:mx-auto lg:max-w-5xl lg:py-20">
      <p className="text-[11px] font-semibold tracking-[0.25em] text-neutral-400 uppercase">
        Sắp ra mắt
      </p>

      <h2 className="mt-4 font-serif text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
        Kho Lưu Trữ Thiên Hà
      </h2>

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
        Đăng ký để nhận quyền truy cập sớm vào các bộ sưu tập giới hạn và nhận
        ưu đãi 10% off cho đơn hàng đầu tiên.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex max-w-md items-center gap-0 rounded-full bg-white p-1.5"
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
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-neutral-800"
        >
          Thông báo cho tôi
        </button>
      </form>
    </section>
  );
}

"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setSuccess(true);
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  }

  if (success) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <Send className="h-7 w-7 text-green-500" />
        </div>
        <h3 className="mt-5 font-serif text-xl font-bold text-neutral-900">
          Gửi thành công!
        </h3>
        <p className="mt-2 text-sm text-neutral-500">
          Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi qua email trong 24 giờ.
        </p>
        <Button className="mt-6" onClick={() => setSuccess(false)}>
          Gửi tin nhắn khác
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          id="contact-name"
          label="Họ và tên"
          placeholder="Nhập họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="contact-email"
          label="Email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          id="contact-phone"
          label="Số điện thoại"
          type="tel"
          placeholder="0901 234 567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          id="contact-subject"
          label="Chủ đề"
          placeholder="Chọn chủ đề"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="contact-message"
          className="text-[11px] font-semibold tracking-widest text-neutral-400 uppercase"
        >
          Nội dung tin nhắn
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Mô tả chi tiết yêu cầu của bạn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
        <Send className="h-4 w-4" />
        {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
      </Button>
    </form>
  );
}

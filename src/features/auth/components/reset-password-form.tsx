"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/modules/auth";

import { AuthCard } from "./auth-card";
import { AuthHeader } from "./auth-header";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!token) {
    return (
      <AuthCard>
        <AuthHeader
          badge="Liên kết không hợp lệ"
          title="Liên kết hết hạn"
          subtitle="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
        />

        <p className="mt-8 text-center text-sm text-neutral-400">
          Cần liên kết mới?{" "}
          <Link
            href="/auth/forgot-password"
            className="text-brand-500 hover:text-brand-600 font-semibold"
          >
            Gửi lại yêu cầu
          </Link>
        </p>
      </AuthCard>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(token, { password });

    if (!result.ok) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setIsDone(true);
  }

  if (isDone) {
    return (
      <AuthCard>
        <AuthHeader
          badge="Hoàn tất"
          title="Đặt lại mật khẩu thành công"
          subtitle="Bạn có thể đăng nhập bằng mật khẩu mới"
        />

        <Button asChild className="w-full" size="lg">
          <Link href="/auth/login">Đăng nhập</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        badge="Đặt lại mật khẩu"
        title="Tạo mật khẩu mới"
        subtitle="Nhập mật khẩu mới cho tài khoản của bạn"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          id="reset-password"
          label="Mật khẩu mới"
          type="password"
          placeholder="Tối thiểu 6 ký tự"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <Input
          id="reset-confirm"
          label="Nhập lại mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý…" : "Đặt lại mật khẩu"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-400">
        Nhớ mật khẩu của bạn?{" "}
        <Link
          href="/auth/login"
          className="text-brand-500 hover:text-brand-600 font-semibold"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthCard>
  );
}

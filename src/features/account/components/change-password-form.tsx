"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { changePassword } from "@/modules/account/actions";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Validate current password
    if (!currentPassword.trim()) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return false;
    }

    // Validate new password length
    if (!newPassword.trim()) {
      setError("Vui lòng nhập mật khẩu mới");
      return false;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setError("Vui lòng xác nhận mật khẩu mới");
      return false;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await changePassword({ currentPassword, newPassword });

    setIsLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess("Đổi mật khẩu thành công");

    // Clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-neutral-900">
          Đổi mật khẩu
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Đảm bảo tài khoản của bạn luôn được bảo mật
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Current Password */}
        <Input
          label="Mật khẩu hiện tại"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Nhập mật khẩu hiện tại"
          disabled={isLoading}
        />

        {/* New Password */}
        <Input
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới"
          disabled={isLoading}
        />

        {/* Confirm Password */}
        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Xác nhận mật khẩu mới"
          disabled={isLoading}
        />

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "bg-brand-500 hover:bg-brand-600 w-full rounded-xl text-white transition-colors",
              isLoading && "cursor-not-allowed opacity-50",
            )}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>
        </div>
      </form>
    </div>
  );
}

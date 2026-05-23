"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

    // Simulate API call with 600ms delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsLoading(false);
    setSuccess("Mật khẩu đã được cập nhật");

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
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-neutral-900">
          Đổi mật khẩu
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Đảm bảo tài khoản của bạn luôn được bảo mật
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
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
              "w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>
        </div>
      </form>
    </div>
  );
}

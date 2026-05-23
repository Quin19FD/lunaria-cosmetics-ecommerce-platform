import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Khôi phục mật khẩu tài khoản Lunaria Beauty",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

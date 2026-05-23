import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào tài khoản Lunaria Beauty của bạn",
};

export default function LoginPage() {
  return <LoginForm />;
}

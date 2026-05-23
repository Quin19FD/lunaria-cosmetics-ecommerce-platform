import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản Lunaria Beauty mới",
};

export default function RegisterPage() {
  return <RegisterForm />;
}

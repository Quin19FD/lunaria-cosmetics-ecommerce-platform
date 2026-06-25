"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type UpdateProfileResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(input: {
  name: string;
  phone?: string;
}): Promise<UpdateProfileResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "Phiên đăng nhập đã hết hạn." };
  }

  const name = input.name.trim();
  if (!name) {
    return { ok: false, error: "Vui lòng nhập họ tên." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name, phone: input.phone?.trim() || null },
  });

  revalidatePath("/account/profile");
  return { ok: true };
}

export type ChangePasswordResult = { ok: true } | { ok: false; error: string };

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ChangePasswordResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "Phiên đăng nhập đã hết hạn." };
  }

  if (input.newPassword.length < 6) {
    return { ok: false, error: "Mật khẩu mới tối thiểu 6 ký tự." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true },
  });
  if (!user?.password) {
    return { ok: false, error: "Tài khoản chưa đặt mật khẩu." };
  }

  const matches = await bcrypt.compare(input.currentPassword, user.password);
  if (!matches) {
    return { ok: false, error: "Mật khẩu hiện tại không đúng." };
  }

  const hashed = await bcrypt.hash(input.newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  revalidatePath("/account/profile");
  return { ok: true };
}

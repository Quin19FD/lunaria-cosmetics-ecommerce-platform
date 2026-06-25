"use server";

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

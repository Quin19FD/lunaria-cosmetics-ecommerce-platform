"use server";

import type { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

export async function updateUserRole(id: string, formData: FormData) {
  const role = formData.get("role") as UserRole;
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
}

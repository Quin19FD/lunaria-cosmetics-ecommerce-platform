"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSuperAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

const updateRoleSchema = z.object({
  id: z.string().min(1),
  role: z.nativeEnum(UserRole),
});

/**
 * Changes a user's role. Only SUPER_ADMIN may do this, and never on their
 * own account (prevents locking the last super admin out by accident).
 */
export async function updateUserRole(id: string, formData: FormData) {
  const admin = await requireSuperAdmin();

  const parsed = updateRoleSchema.safeParse({
    id,
    role: formData.get("role"),
  });
  if (!parsed.success) {
    throw new Error("Invalid role update");
  }
  if (parsed.data.id === admin.id) {
    throw new Error("You cannot change your own role");
  }

  await prisma.user.update({
    where: { id: parsed.data.id },
    data: { role: parsed.data.role },
  });
  revalidatePath("/admin/users");
}

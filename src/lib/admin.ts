import type { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface AdminSession {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
}

const IS_ADMIN_ROLE: Record<UserRole, boolean> = {
  CUSTOMER: false,
  ADMIN: true,
  SUPER_ADMIN: true,
};

/**
 * Guards an admin route or Server Action. Redirects unauthenticated users to
 * login and non-admin users back to the storefront. Returns the admin session.
 *
 * Server Actions are public POST endpoints, so every admin action must call
 * this itself — the layout guard only protects rendering. The role is re-read
 * from the database because the JWT keeps the role it was issued with, which
 * would let a demoted admin keep access until the token expires. Wrapped in
 * React `cache()` so layout + page in one request share a single lookup.
 */
export const requireAdmin = cache(async (): Promise<AdminSession> => {
  const session = await auth();
  const sessionUser = session?.user;

  if (!sessionUser?.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  if (!user) {
    redirect("/auth/login");
  }
  if (!IS_ADMIN_ROLE[user.role]) {
    redirect("/");
  }

  return user;
});

/** Like {@link requireAdmin}, but only SUPER_ADMIN passes. */
export async function requireSuperAdmin(): Promise<AdminSession> {
  const admin = await requireAdmin();
  if (admin.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }
  return admin;
}

import type { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

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
 * Guards an admin route. Redirects unauthenticated users to login and
 * non-admin users back to the storefront. Returns the admin session.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }
  if (!user.role || !IS_ADMIN_ROLE[user.role]) {
    redirect("/");
  }

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? "",
    image: user.image ?? null,
    role: user.role,
  };
}

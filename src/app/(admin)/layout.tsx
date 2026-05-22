import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role === "CUSTOMER") {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* <AdminSidebar /> */}
      <div className="flex-1">
        {/* <AdminHeader /> */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

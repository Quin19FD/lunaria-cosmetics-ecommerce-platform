import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useAuthStore } from "@/store/use-auth-store";

/**
 * Returns a guard function that checks if user is logged in.
 * If not, redirects to login and returns false.
 * If yes, returns true so the caller can proceed.
 */
export function useRequireAuth() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const requireAuth = useCallback(() => {
    if (!user) {
      router.push("/auth/login");
      return false;
    }
    return true;
  }, [user, router]);

  return { user, requireAuth };
}

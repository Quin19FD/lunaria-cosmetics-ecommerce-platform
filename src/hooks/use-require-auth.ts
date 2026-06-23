import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

/**
 * Returns a guard function that checks if user is logged in.
 * If not, redirects to login and returns false.
 * If yes, returns true so the caller can proceed.
 */
export function useRequireAuth() {
  const { data: session } = useSession();
  const user = session?.user ?? null;
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

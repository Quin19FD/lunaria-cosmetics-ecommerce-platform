import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AuthCard, AuthHeader } from "@/features/auth";

export const metadata: Metadata = {
  title: "Lỗi xác thực",
};

export default function AuthErrorPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Authentication Error"
        subtitle="Something went wrong during authentication"
      />

      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <Button asChild>
          <Link href="/auth/login">Back to Sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}

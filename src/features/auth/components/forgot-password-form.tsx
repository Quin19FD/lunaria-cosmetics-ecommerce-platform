"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/modules/auth";

import { AuthCard } from "./auth-card";
import { AuthHeader } from "./auth-header";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await requestPasswordReset({ email });
      if (result.ok) {
        setIsSent(true);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSent) {
    return (
      <AuthCard>
        <AuthHeader
          badge="Check Your Inbox"
          title="Email Sent"
          subtitle="We've sent a password reset link to your email address"
        />

        <div className="space-y-4 text-center">
          <div className="bg-brand-50 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-brand-500 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <p className="text-sm text-neutral-500">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              onClick={() => setIsSent(false)}
              className="text-brand-500 hover:text-brand-600 font-semibold"
            >
              Try again
            </button>
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-neutral-400">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-brand-500 hover:text-brand-600 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        badge="Password Recovery"
        title="Forgot Password?"
        subtitle="Enter your email and we'll send you a reset link"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          id="forgot-email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Sending…" : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-400">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="text-brand-500 hover:text-brand-600 font-semibold"
        >
          Back to Sign in
        </Link>
      </p>
    </AuthCard>
  );
}

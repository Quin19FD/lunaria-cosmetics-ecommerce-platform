"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/modules/auth";
import { useAuthStore } from "@/store/use-auth-store";

import { AuthCard } from "./auth-card";
import { AuthHeader } from "./auth-header";
import { Divider } from "./divider";
import { SocialButtons } from "./social-buttons";

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await authService.login({ email, password });

    if (result.success) {
      setUser(result.data);
      router.push("/");
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <AuthCard>
      <AuthHeader
        badge="The Ethereal Alchemist"
        title="Welcome Back"
        subtitle="Continue your sensory journey"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          id="login-email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          id="login-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          rightElement={
            <Link
              href="/auth/forgot-password"
              className="text-[11px] font-semibold tracking-wider text-brand-500 uppercase hover:text-brand-600"
            >
              Forgot?
            </Link>
          }
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <Divider />
      <SocialButtons />

      <p className="mt-8 text-center text-sm text-neutral-400">
        New to the bloom?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-brand-500 hover:text-brand-600"
        >
          Create Account
        </Link>
      </p>
    </AuthCard>
  );
}

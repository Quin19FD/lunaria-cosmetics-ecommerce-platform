"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/modules/auth";

import { AuthCard } from "./auth-card";
import { AuthHeader } from "./auth-header";
import { Divider } from "./divider";
import { SocialButtons } from "./social-buttons";

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);
    const result = await registerUser({ name, email, password });

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <AuthCard>
      <AuthHeader
        badge="Begin Your Journey"
        title="Create Account"
        subtitle="Join our world of luxury beauty"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          id="register-name"
          label="Full Name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />

        <Input
          id="register-email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          id="register-password"
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <Input
          id="register-confirm"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <Divider />
      <SocialButtons />

      <p className="mt-8 text-center text-sm text-neutral-400">
        Already have an account?{" "}
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

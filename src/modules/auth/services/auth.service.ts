"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";

import { registerSchema } from "../schemas";
import type { AuthResult } from "../types";

/**
 * Creates a new user with a bcrypt-hashed password.
 * Validation mirrors the client form; returns a discriminated result
 * so the UI can surface a localized error message.
 */
export async function registerUser(input: unknown): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
    };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { success: false, error: "Email đã được sử dụng" };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, password: hashed },
    select: { id: true, name: true, email: true, image: true },
  });

  return {
    success: true,
    data: {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      image: user.image ?? undefined,
    },
  };
}

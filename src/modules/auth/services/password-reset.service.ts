"use server";

import crypto from "crypto";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mail";

import { forgotPasswordSchema, resetPasswordSchema } from "../schemas";

type Result = { ok: true } | { ok: false; error: string };

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Issues a single-use password-reset token for the given email and mails the
 * reset link. ALWAYS resolves `{ ok: true }` when the input is a valid email,
 * regardless of whether an account exists, so callers cannot probe for
 * registered addresses. A mail failure is logged but does not leak either.
 */
export async function requestPasswordReset(input: unknown): Promise<Result> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Email không hợp lệ",
    };
  }

  const email = parsed.data.email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    try {
      await sendMail({
        to: email,
        subject: "Đặt lại mật khẩu Lunaria Cosmetics",
        text:
          `Xin chào,\n\n` +
          `Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. ` +
          `Vui lòng truy cập liên kết sau để tạo mật khẩu mới:\n\n${resetUrl}\n\n` +
          `Liên kết này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.\n`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
            <h2 style="color: #be185d;">Đặt lại mật khẩu</h2>
            <p>Xin chào,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Lunaria Cosmetics của bạn. Nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
            <p style="margin: 24px 0;">
              <a href="${resetUrl}" style="background: #be185d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Đặt lại mật khẩu</a>
            </p>
            <p>Hoặc sao chép liên kết sau vào trình duyệt:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p style="color: #6b7280; font-size: 14px;">Liên kết này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("[password-reset] failed to send reset email", error);
    }
  }

  return { ok: true };
}

/**
 * Consumes a reset token and sets a new bcrypt-hashed password. The token is
 * single-use: all tokens for the identifier are removed on success. Invalid,
 * expired, or orphaned tokens yield a generic error.
 */
export async function resetPassword(
  token: string,
  input: unknown,
): Promise<Result> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Mật khẩu không hợp lệ",
    };
  }

  const invalid = "Liên kết không hợp lệ hoặc đã hết hạn.";

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });
  if (!record || record.expires < new Date()) {
    return { ok: false, error: invalid };
  }

  const email = record.identifier;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, error: invalid };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  return { ok: true };
}

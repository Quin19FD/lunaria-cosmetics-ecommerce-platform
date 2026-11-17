import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/db";
import {
  RATE_LIMITS,
  isRateLimited,
  recordRateLimitHit,
  requestIp,
} from "@/lib/rate-limit";
import { loginSchema } from "@/modules/auth/schemas";

/** Surfaced to the client as `result.code === "rate_limited"`. */
class RateLimitedSignin extends CredentialsSignin {
  code = "rate_limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase();

        // Only failed attempts count, so legitimate repeat logins are fine.
        const ip = await requestIp();
        const checks = [
          [RATE_LIMITS.loginFailures, `${ip}:${normalizedEmail}`],
          [RATE_LIMITS.loginFailuresIp, ip],
        ] as const;
        if (await isRateLimited(checks)) throw new RateLimitedSignin();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        const valid =
          !!user?.password && (await bcrypt.compare(password, user.password));
        if (!user || !valid) {
          await recordRateLimitHit(checks);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = token.role as typeof session.user.role;
      }
      return session;
    },
  },
});

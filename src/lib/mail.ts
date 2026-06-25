import nodemailer, { type Transporter } from "nodemailer";

const MAIL_FROM =
  process.env.MAIL_FROM ?? "Lunaria Cosmetics <no-reply@lunaria.local>";

let cached: Transporter | null = null;

/**
 * Returns a singleton transport. When SMTP_HOST is set we deliver over real
 * SMTP; otherwise we fall back to nodemailer's JSON transport, which composes a
 * genuine RFC822 message and returns it (logged) instead of delivering — so the
 * app stays functional in dev without mail credentials.
 */
function getTransport(): Transporter {
  if (cached) return cached;

  const host = process.env.SMTP_HOST;
  if (host) {
    cached = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  } else {
    cached = nodemailer.createTransport({ jsonTransport: true });
  }
  return cached;
}

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail(msg: MailMessage): Promise<void> {
  await getTransport().sendMail({ from: MAIL_FROM, ...msg });
  if (!process.env.SMTP_HOST) {
    // jsonTransport: surface the composed message so dev links are visible.
    console.info(
      `[mail] not delivered (no SMTP_HOST) → to=${msg.to} subject="${msg.subject}"`,
    );
  }
}

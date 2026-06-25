import { formatPrice } from "@/lib/utils";

export interface OrderEmailData {
  id: string;
  customerName: string | null;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  paymentMethod: "COD" | "BANK" | "CARD";
  items: { name: string; quantity: number; unitPrice: number }[];
  address: {
    fullName: string;
    phone: string;
    street: string;
    ward: string | null;
    district: string;
    city: string;
  };
}

const PAYMENT_METHOD_LABELS: Record<OrderEmailData["paymentMethod"], string> = {
  COD: "Thanh toán khi nhận hàng",
  BANK: "Chuyển khoản",
  CARD: "Thẻ",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function addressLine(address: OrderEmailData["address"]): string {
  return [address.street, address.ward, address.district, address.city]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(", ");
}

/**
 * Pure, framework-free builder for the order-confirmation email. Kept out of the
 * "use server" module so it can be imported and unit-tested directly.
 */
export function buildOrderConfirmationEmail(data: OrderEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const code = data.id.slice(0, 8).toUpperCase();
  const greetingName = data.customerName?.trim() || "Quý khách";
  const paymentLabel = PAYMENT_METHOD_LABELS[data.paymentMethod];
  const line = addressLine(data.address);

  const subject = `Xác nhận đơn hàng #${code} — Lunaria Cosmetics`;

  const itemRowsHtml = data.items
    .map((item) => {
      const lineTotal = formatPrice(item.unitPrice * item.quantity);
      return `        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;">${escapeHtml(
            item.name,
          )} × ${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#333;white-space:nowrap;">${lineTotal}</td>
        </tr>`;
    })
    .join("\n");

  const summaryRow = (label: string, value: string, strong = false) =>
    `        <tr>
          <td style="padding:4px 0;text-align:right;color:#555;${
            strong ? "font-weight:600;font-size:16px;color:#111;" : ""
          }">${label}</td>
          <td style="padding:4px 0;text-align:right;white-space:nowrap;${
            strong
              ? "font-weight:700;font-size:16px;color:#111;"
              : "color:#333;"
          }">${value}</td>
        </tr>`;

  const summaryRowsHtml = [
    summaryRow("Tạm tính", formatPrice(data.subtotal)),
    summaryRow(
      "Phí vận chuyển",
      data.shippingCost > 0 ? formatPrice(data.shippingCost) : "Miễn phí",
    ),
    ...(data.discount > 0
      ? [summaryRow("Giảm giá", `-${formatPrice(data.discount)}`)]
      : []),
    summaryRow("Tổng cộng", formatPrice(data.total), true),
  ].join("\n");

  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:'Segoe UI',Arial,sans-serif;color:#333;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <div style="background:#1f2937;padding:24px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;letter-spacing:1px;">LUNARIA COSMETICS</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="margin:0 0 8px;font-size:18px;color:#111;">Cảm ơn bạn đã đặt hàng!</h2>
        <p style="margin:0 0 4px;color:#555;">Xin chào ${escapeHtml(greetingName)},</p>
        <p style="margin:0 0 16px;color:#555;">Chúng tôi đã nhận được đơn hàng <strong>#${code}</strong> của bạn và đang xử lý.</p>

        <h3 style="margin:24px 0 8px;font-size:15px;color:#111;border-bottom:2px solid #1f2937;padding-bottom:4px;">Chi tiết đơn hàng</h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
${itemRowsHtml}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:12px;">
${summaryRowsHtml}
        </table>

        <h3 style="margin:24px 0 8px;font-size:15px;color:#111;border-bottom:2px solid #1f2937;padding-bottom:4px;">Địa chỉ giao hàng</h3>
        <p style="margin:0;color:#555;line-height:1.6;">
          <strong style="color:#333;">${escapeHtml(data.address.fullName)}</strong><br />
          ${escapeHtml(data.address.phone)}<br />
          ${escapeHtml(line)}
        </p>

        <h3 style="margin:24px 0 8px;font-size:15px;color:#111;border-bottom:2px solid #1f2937;padding-bottom:4px;">Phương thức thanh toán</h3>
        <p style="margin:0;color:#555;">${escapeHtml(paymentLabel)}</p>
      </div>
      <div style="background:#f3f4f6;padding:16px 24px;text-align:center;color:#9ca3af;font-size:12px;">
        © Lunaria Cosmetics — Cảm ơn bạn đã tin tưởng và mua sắm.
      </div>
    </div>
  </div>
</body>
</html>`;

  const textLines = [
    `Xác nhận đơn hàng #${code} — Lunaria Cosmetics`,
    "",
    `Xin chào ${greetingName},`,
    `Chúng tôi đã nhận được đơn hàng #${code} của bạn và đang xử lý.`,
    "",
    "Chi tiết đơn hàng:",
    ...data.items.map(
      (item) =>
        `- ${item.name} × ${item.quantity}: ${formatPrice(
          item.unitPrice * item.quantity,
        )}`,
    ),
    "",
    `Tạm tính: ${formatPrice(data.subtotal)}`,
    `Phí vận chuyển: ${
      data.shippingCost > 0 ? formatPrice(data.shippingCost) : "Miễn phí"
    }`,
    ...(data.discount > 0 ? [`Giảm giá: -${formatPrice(data.discount)}`] : []),
    `Tổng cộng: ${formatPrice(data.total)}`,
    "",
    "Địa chỉ giao hàng:",
    data.address.fullName,
    data.address.phone,
    line,
    "",
    `Phương thức thanh toán: ${paymentLabel}`,
    "",
    "© Lunaria Cosmetics — Cảm ơn bạn đã tin tưởng và mua sắm.",
  ];

  return { subject, html, text: textLines.join("\n") };
}

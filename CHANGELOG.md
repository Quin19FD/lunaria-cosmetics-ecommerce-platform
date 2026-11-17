# Changelog

Mọi thay đổi đáng kể ghi vào đây — format [Keep a Changelog](https://keepachangelog.com), versioning [SemVer](https://semver.org).
**8sync rule:** mỗi PR cập nhật mục `Unreleased` bên dưới.

## [Unreleased]

### Security

- Mọi Server Action trong `/admin` giờ tự gọi `requireAdmin()` — trước đây chỉ layout chặn việc xem trang, nên khách hàng đã đăng nhập có thể gọi thẳng action (kể cả tự nâng mình lên `SUPER_ADMIN` qua `updateUserRole`).
- `requireAdmin()` đọc lại role từ database thay vì tin role trong JWT, nên admin bị hạ quyền mất quyền ngay.
- Đổi vai trò người dùng: chỉ `SUPER_ADMIN`, role được validate bằng Zod, không cho tự đổi role của chính mình; form đổi role bị ẩn với người không đủ quyền.
- `sendOrderConfirmationEmail` không còn là Server Action công khai (bỏ `"use server"` ở `modules/orders/emails.ts`).

### Added

- CI GitHub Actions: `pnpm check` + `pnpm build` trên Linux/Windows/macOS, và e2e Playwright trên Postgres service.
- E2E `e2e/admin-authz.spec.ts`: CUSTOMER và ADMIN không đổi được role qua action; SUPER_ADMIN là đối chứng.
- Thanh toán Stripe thật: tạo PaymentIntent, form thẻ dùng Stripe Elements, và webhook `/api/webhooks/stripe` xác minh chữ ký rồi xác nhận đơn (idempotent).
- Email xác nhận đơn hàng qua SMTP (Nodemailer) — gửi khi đặt COD/chuyển khoản và khi thanh toán thẻ thành công.
- Quên/đặt lại mật khẩu: gửi link reset dùng-một-lần (token hết hạn sau 1 giờ) + trang `/auth/reset-password`.
- Trang quản trị CRUD: Mã giảm giá (`/admin/coupons`), Khuyến mãi (`/admin/promotions`), Bộ sưu tập (`/admin/collections`).
- Mô hình Prisma `Coupon`, `Promotion`, `Collection` và lịch sử migration Prisma (thay cho `db push`).
- Bộ kiểm thử e2e Playwright (storefront, auth, admin, webhook Stripe).

### Changed

- Khuyến mãi & bộ sưu tập đọc từ database thay vì dữ liệu mock; service chuyển sang async Prisma.
- Thay luồng thanh toán thẻ mô phỏng bằng luồng Stripe thật (đơn chỉ chuyển `PAID` qua webhook).

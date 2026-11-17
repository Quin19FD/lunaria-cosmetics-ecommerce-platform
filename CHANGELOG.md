# Changelog

Mọi thay đổi đáng kể ghi vào đây — format [Keep a Changelog](https://keepachangelog.com), versioning [SemVer](https://semver.org).
**8sync rule:** mỗi PR cập nhật mục `Unreleased` bên dưới.

## [Unreleased]

### Security

- Mọi Server Action trong `/admin` giờ tự gọi `requireAdmin()` — trước đây chỉ layout chặn việc xem trang, nên khách hàng đã đăng nhập có thể gọi thẳng action (kể cả tự nâng mình lên `SUPER_ADMIN` qua `updateUserRole`).
- `requireAdmin()` đọc lại role từ database thay vì tin role trong JWT, nên admin bị hạ quyền mất quyền ngay.
- Đổi vai trò người dùng: chỉ `SUPER_ADMIN`, role được validate bằng Zod, không cho tự đổi role của chính mình; form đổi role bị ẩn với người không đủ quyền.
- `sendOrderConfirmationEmail` không còn là Server Action công khai (bỏ `"use server"` ở `modules/orders/emails.ts`).
- Nâng `next` 15.5.29, `next-auth` 5.0.0-beta.32, `@auth/core` 0.41.3, `@auth/prisma-adapter` 2.11.3, `nodemailer` 10.6 để vá các advisory critical/high (RCE ở Image Optimization, lỗi chuẩn hoá email của Auth.js…); ép `postcss`/`nanoid`/`source-map-js` lên bản vá qua `pnpm.overrides`.
- Rate limit (fixed-window, lưu ở bảng Postgres `rate_limits`): đăng nhập sai 5 lần/15 phút theo IP+email và 20 lần/15 phút theo IP; đăng ký 5 lần/giờ/IP; quên mật khẩu 3 lần/15 phút/email và 10 lần/giờ/IP; kiểm tra mã giảm giá 30 lần/10 phút/IP.

### Added

- CI GitHub Actions: `pnpm check` (typecheck, lint, format, unit test) trên Linux/Windows/macOS; `pnpm build` + e2e Playwright trên Postgres service.
- Unit test với Vitest (`pnpm test`), cho rate limit, giảm giá, phí ship, điều kiện coupon và hoàn kho; e2e `e2e/rate-limit.spec.ts` kiểm khoá đăng nhập sau 5 lần sai; `e2e/inventory.spec.ts` kiểm huỷ đơn (admin và Stripe) trả kho đúng một lần.
- E2E `e2e/admin-authz.spec.ts`: CUSTOMER và ADMIN không đổi được role qua action; SUPER_ADMIN là đối chứng.
- Thanh toán Stripe thật: tạo PaymentIntent, form thẻ dùng Stripe Elements, và webhook `/api/webhooks/stripe` xác minh chữ ký rồi xác nhận đơn (idempotent).
- Email xác nhận đơn hàng qua SMTP (Nodemailer) — gửi khi đặt COD/chuyển khoản và khi thanh toán thẻ thành công.
- Quên/đặt lại mật khẩu: gửi link reset dùng-một-lần (token hết hạn sau 1 giờ) + trang `/auth/reset-password`.
- Trang quản trị CRUD: Mã giảm giá (`/admin/coupons`), Khuyến mãi (`/admin/promotions`), Bộ sưu tập (`/admin/collections`).
- Mô hình Prisma `Coupon`, `Promotion`, `Collection` và lịch sử migration Prisma (thay cho `db push`).
- Bộ kiểm thử e2e Playwright (storefront, auth, admin, webhook Stripe).

### Fixed

- Đặt hàng không còn bán vượt tồn kho khi nhiều người mua cùng lúc: kiểm kho và trừ kho gộp thành một `UPDATE … WHERE stock >= qty`; lượt dùng coupon cũng được giành bằng một update có điều kiện.
- Huỷ/hoàn tiền đơn trả lại tồn kho **và** lượt dùng coupon, đúng một lần kể cả khi bấm lặp hoặc gọi đồng thời; đơn đã huỷ không mở lại được.
- Webhook Stripe `payment_intent.canceled` huỷ đơn thẻ chưa thanh toán và trả kho (`payment_failed` được bỏ qua vì khách có thể thử thẻ khác).
- Đơn tạo từ admin giờ trừ tồn kho (trước đây không trừ, nên huỷ đơn làm kho tăng ảo); trạng thái đơn được validate bằng Zod.

### Changed

- Quy tắc phí ship, tổng tiền và điều kiện coupon gom về `modules/orders/pricing.ts` và `modules/coupons/eligibility.ts`, dùng chung cho server và giao diện giỏ/checkout.

- README viết lại: ảnh, tính năng, tech stack, kiến trúc, cách chạy bằng Docker + seed, tài khoản demo, cách chạy test, badge CI.
- Bỏ khỏi git cấu hình AI tool (`agents/`, `.cursor/`, `.omp/`) và ảnh debug; ảnh đẹp chuyển sang `docs/images/`.

- Khuyến mãi & bộ sưu tập đọc từ database thay vì dữ liệu mock; service chuyển sang async Prisma.
- Thay luồng thanh toán thẻ mô phỏng bằng luồng Stripe thật (đơn chỉ chuyển `PAID` qua webhook).

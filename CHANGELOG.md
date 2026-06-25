# Changelog

Mọi thay đổi đáng kể ghi vào đây — format [Keep a Changelog](https://keepachangelog.com), versioning [SemVer](https://semver.org).
**8sync rule:** mỗi PR cập nhật mục `Unreleased` bên dưới.

## [Unreleased]

### Added
- Thanh toán Stripe thật: tạo PaymentIntent, form thẻ dùng Stripe Elements, và webhook `/api/webhooks/stripe` xác minh chữ ký rồi xác nhận đơn (idempotent).
- Email xác nhận đơn hàng qua SMTP (Nodemailer) — gửi khi đặt COD/chuyển khoản và khi thanh toán thẻ thành công.
- Quên/đặt lại mật khẩu: gửi link reset dùng-một-lần (token hết hạn sau 1 giờ) + trang `/auth/reset-password`.
- Trang quản trị CRUD: Mã giảm giá (`/admin/coupons`), Khuyến mãi (`/admin/promotions`), Bộ sưu tập (`/admin/collections`).
- Mô hình Prisma `Coupon`, `Promotion`, `Collection` và lịch sử migration Prisma (thay cho `db push`).
- Bộ kiểm thử e2e Playwright (storefront, auth, admin, webhook Stripe).

### Changed
- Khuyến mãi & bộ sưu tập đọc từ database thay vì dữ liệu mock; service chuyển sang async Prisma.
- Thay luồng thanh toán thẻ mô phỏng bằng luồng Stripe thật (đơn chỉ chuyển `PAID` qua webhook).


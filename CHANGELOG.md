# Changelog

Mọi thay đổi đáng kể ghi vào đây — format [Keep a Changelog](https://keepachangelog.com), versioning [SemVer](https://semver.org).
**8sync rule:** mỗi PR cập nhật mục `Unreleased` bên dưới.

## [Unreleased]

### Security

- Cleared all `pnpm audit` findings (production and dev): zod 4.6.7 and vitest 4 as direct upgrades; sharp 0.35.5, deepmerge-ts 8, js-yaml, esbuild, brace-expansion and minimatch 11 via pnpm overrides.
- Đánh giá sản phẩm không còn hiển thị email của người viết khi họ chưa đặt tên (hiển thị "Khách hàng").
- Mọi Server Action trong `/admin` giờ tự gọi `requireAdmin()` — trước đây chỉ layout chặn việc xem trang, nên khách hàng đã đăng nhập có thể gọi thẳng action (kể cả tự nâng mình lên `SUPER_ADMIN` qua `updateUserRole`).
- `requireAdmin()` đọc lại role từ database thay vì tin role trong JWT, nên admin bị hạ quyền mất quyền ngay.
- Đổi vai trò người dùng: chỉ `SUPER_ADMIN`, role được validate bằng Zod, không cho tự đổi role của chính mình; form đổi role bị ẩn với người không đủ quyền.
- `sendOrderConfirmationEmail` không còn là Server Action công khai (bỏ `"use server"` ở `modules/orders/emails.ts`).
- Nâng `next` 15.5.29, `next-auth` 5.0.0-beta.32, `@auth/core` 0.41.3, `@auth/prisma-adapter` 2.11.3, `nodemailer` 10.6 để vá các advisory critical/high (RCE ở Image Optimization, lỗi chuẩn hoá email của Auth.js…); ép `postcss`/`nanoid`/`source-map-js` lên bản vá qua `pnpm.overrides`.
- Rate limit (fixed-window, lưu ở bảng Postgres `rate_limits`): đăng nhập sai 5 lần/15 phút theo IP+email và 20 lần/15 phút theo IP; đăng ký 5 lần/giờ/IP; quên mật khẩu 3 lần/15 phút/email và 10 lần/giờ/IP; kiểm tra mã giảm giá 30 lần/10 phút/IP.

### Added

- `pnpm test:visual` + workflow `Visual check`: mở storefront trên Chromium desktop, WebKit desktop và Chromium 360px (touch); kiểm hiệu ứng tilt 3D bật với chuột, tắt với touch và `prefers-reduced-motion`; kiểm tràn ngang, ảnh hỏng, lỗi console; lưu ảnh chụp thành artifact.
- Job định kỳ `/api/cron/release-stale-orders` (Vercel Cron, mỗi ngày): huỷ đơn thẻ `PENDING`/`UNPAID` quá 1 giờ và trả tồn kho + lượt dùng coupon. Huỷ PaymentIntent trên Stripe trước; Stripe từ chối (đã trả tiền) thì bỏ qua đơn đó. Route yêu cầu `Authorization: Bearer $CRON_SECRET`.
- SEO: `sitemap.xml` (sản phẩm, bộ sưu tập), `robots.txt`, ảnh Open Graph mặc định, metadata + canonical + Open Graph cho trang sản phẩm và bộ sưu tập, JSON-LD `Product` (giá theo biến thể, tồn kho, điểm đánh giá lấy từ review thật).
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

- Sáu liên kết ở footer (`/about`, `/faq`, `/privacy`, `/terms`, `/shipping`, `/returns`) không còn dẫn tới 404: thêm các trang thông tin tĩnh.
- Ô danh mục ở trang chủ không còn ảnh hỏng: seed gán ảnh cho danh mục, và ảnh dự phòng là file local `/placeholder.svg` thay cho `placehold.co` (host không nằm trong `images.remotePatterns` nên bị trả 400). Thêm favicon (`src/app/icon.svg`).
- Thay 3 ảnh Unsplash có chữ/logo in trên bao bì (ô danh mục "Dưỡng da", hai bộ sưu tập, ảnh phụ ở hero, ảnh trang đăng nhập) bằng ảnh đã soát ở cỡ 1400px.
- Đặt hàng không còn bán vượt tồn kho khi nhiều người mua cùng lúc: kiểm kho và trừ kho gộp thành một `UPDATE … WHERE stock >= qty`; lượt dùng coupon cũng được giành bằng một update có điều kiện.
- Huỷ/hoàn tiền đơn trả lại tồn kho **và** lượt dùng coupon, đúng một lần kể cả khi bấm lặp hoặc gọi đồng thời; đơn đã huỷ không mở lại được.
- Webhook Stripe `payment_intent.canceled` huỷ đơn thẻ chưa thanh toán và trả kho (`payment_failed` được bỏ qua vì khách có thể thử thẻ khác).
- Đơn tạo từ admin giờ trừ tồn kho (trước đây không trừ, nên huỷ đơn làm kho tăng ảo); trạng thái đơn được validate bằng Zod.

### Changed

- Giao diện storefront có hiệu ứng 3D (chỉ CSS 3D transform + Framer Motion, không thêm thư viện): thẻ sản phẩm nghiêng theo con trỏ, ảnh nổi lên theo `translateZ` và có vệt sáng; hero trang chủ là cảnh parallax nhiều lớp theo con trỏ và cuộn trang; ảnh trang chi tiết sản phẩm xoay 3D khi đổi ảnh; thẻ bộ sưu tập là chồng "tấm" màu brand tách lớp khi hover. Tắt hết khi người dùng bật `prefers-reduced-motion`; không nghiêng trên thiết bị cảm ứng. Component dùng lại: `Tilt3D`, `Tilt3DLayer`, `Tilt3DSheen`, `ParallaxScene`, `ParallaxLayer` trong `src/components/shared`.
- Hoàn thiện giao diện: trạng thái loading (skeleton đúng khung) và lỗi có nút "Thử lại" cho trang sản phẩm và giỏ hàng; bộ lọc mobile là dialog đóng bằng Escape; giỏ hàng không tràn ngang ở 360px; vòng focus rõ ràng cho thẻ, nút và thumbnail (thumbnail điều khiển bằng phím mũi tên); badge, giá và nút CTA phụ ở hero đủ tương phản AA; hero chỉ còn một `h1`.

- Ảnh sản phẩm trong seed dùng ảnh Unsplash không có logo thương hiệu (thay ảnh placeholder chữ, vốn không hiển thị được ở bản production vì `placehold.co` không nằm trong `images.remotePatterns`). Ảnh danh mục, bộ sưu tập, khuyến mãi và trang đăng nhập có nhãn hiệu thật (Chanel, Curology, Bobbi Brown, Estée Lauder…) hoặc đã bị gỡ khỏi Unsplash được thay bằng ảnh không logo.
- Quy tắc phí ship, tổng tiền và điều kiện coupon gom về `modules/orders/pricing.ts` và `modules/coupons/eligibility.ts`, dùng chung cho server và giao diện giỏ/checkout.

- README viết lại: ảnh, tính năng, tech stack, kiến trúc, cách chạy bằng Docker + seed, tài khoản demo, cách chạy test, badge CI.
- Bỏ khỏi git cấu hình AI tool (`agents/`, `.cursor/`, `.omp/`) và ảnh debug; ảnh đẹp chuyển sang `docs/images/`.

- Khuyến mãi & bộ sưu tập đọc từ database thay vì dữ liệu mock; service chuyển sang async Prisma.
- Thay luồng thanh toán thẻ mô phỏng bằng luồng Stripe thật (đơn chỉ chuyển `PAID` qua webhook).

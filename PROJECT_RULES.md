# Lunaria — Project Rules

> Tài liệu này là **luật bắt buộc**, không phải gợi ý.
> Mọi contributor (người hoặc AI) PHẢI tuân thủ toàn bộ quy tắc dưới đây.
> Vi phạm bất kỳ mục nào = PR bị reject, không ngoại lệ.

---

## 1. Giai đoạn hiện tại: UI-ONLY

Dự án đang ở giai đoạn xây dựng giao diện. Backend sẽ được tích hợp sau.

### TUYỆT ĐỐI KHÔNG ĐƯỢC:

| Hành vi                                     | Lý do                            |
| ------------------------------------------- | -------------------------------- |
| Tạo file trong `prisma/`                    | Chưa có database layer           |
| Import `@prisma/client`                     | Chưa có database layer           |
| Tạo file `src/lib/db.ts` hoặc tương tự      | Chưa có database layer           |
| Tạo Server Actions (`"use server"`)         | Chưa có backend logic            |
| Tạo Route Handlers (`app/api/`)             | Chưa có API layer                |
| Gọi fetch đến API endpoint thật             | Dùng mock data thay thế          |
| Tạo file migration                          | Chưa có database layer           |
| Viết business logic trong UI component      | Vi phạm separation of concerns   |
| Dùng `next-auth` / bất kỳ auth library nào  | Chưa có auth backend             |
| Cài thêm dependency backend (bcrypt, jose…) | Ngoài phạm vi giai đoạn hiện tại |

### BẮT BUỘC:

- Mọi dữ liệu hiển thị PHẢI đến từ mock data (`src/lib/mock-data/`)
- Mock data PHẢI có type đầy đủ, khớp với `src/types/`
- UI component KHÔNG chứa logic tính toán — tách ra `src/lib/` hoặc custom hook

---

## 2. Tech Stack

| Layer            | Công nghệ                    | Ghi chú                           |
| ---------------- | ---------------------------- | --------------------------------- |
| Framework        | Next.js 15 (App Router)      | Turbopack dev                     |
| Language         | TypeScript (strict mode)     | Không dùng `any`, không `as` bừa  |
| Styling          | Tailwind CSS v4              | `@theme` tokens trong globals.css |
| UI Components    | shadcn/ui + Radix primitives | CVA cho variants                  |
| Animation        | Framer Motion                | `reducedMotion: "user"` bắt buộc  |
| State Management | Zustand                      | Chỉ cho client-side UI state      |
| Validation       | Zod                          | Schema cho form + search params   |
| Icons            | Lucide React                 | Không dùng icon library khác      |
| Package Manager  | pnpm                         | Không npm, không yarn             |

---

## 3. Cấu trúc thư mục

```
src/
├── app/                          # Next.js App Router
│   ├── (storefront)/             # Route group: trang công khai
│   ├── (admin)/                  # Route group: admin dashboard
│   ├── (auth)/                   # Route group: đăng nhập / đăng ký
│   ├── layout.tsx                # Root layout duy nhất
│   └── globals.css               # Design tokens + base styles
│
├── components/
│   ├── ui/                       # Atomic: Button, Input, Skeleton, Card…
│   ├── shared/                   # Composite: Header, Footer, ProductCard…
│   └── providers/                # Context providers (Session, Motion…)
│
├── features/                     # Feature modules (xem mục 4)
│   ├── products/
│   ├── cart/
│   ├── auth/
│   └── admin/
│
├── hooks/                        # Custom hooks dùng chung
├── store/                        # Zustand stores
├── lib/                          # Utilities, helpers, constants
│   ├── mock-data/                # Mock data cho UI development
│   ├── utils.ts                  # cn(), formatPrice()…
│   ├── constants.ts              # SITE_CONFIG, PAGINATION…
│   └── validators.ts             # Zod schemas dùng chung
│
└── types/                        # TypeScript type definitions
```

### Quy tắc thư mục:

- **KHÔNG** tạo thư mục mới ở `src/` root mà không có approval
- **KHÔNG** đặt component ngoài `components/` hoặc `features/`
- **KHÔNG** tạo file util rời rạc — gom vào `lib/` hoặc hook tương ứng
- File trong `app/` CHỈ chứa: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Logic UI phức tạp PHẢI nằm trong `features/<module>/`

---

## 4. Kiến trúc Feature / Module

Mỗi feature là một thư mục tự chứa (self-contained):

```
features/products/
├── components/           # Components chỉ dùng trong feature này
│   ├── product-card.tsx
│   └── product-grid.tsx
├── hooks/                # Hooks chỉ dùng trong feature này
│   └── use-product-filter.ts
├── types.ts              # Types riêng của feature
└── index.ts              # Public API — barrel export
```

### Quy tắc:

- Feature KHÔNG import trực tiếp internal file của feature khác
- Muốn dùng chung → chuyển vào `components/shared/` hoặc `hooks/`
- Barrel export (`index.ts`) là API duy nhất mà bên ngoài được import
- Component dùng ở ≥ 2 features → chuyển ra `components/shared/`

---

## 5. Naming Convention

### Files và thư mục:

| Loại      | Quy tắc          | Ví dụ               |
| --------- | ---------------- | ------------------- |
| Component | `kebab-case.tsx` | `product-card.tsx`  |
| Hook      | `use-*.ts`       | `use-cart-store.ts` |
| Utility   | `kebab-case.ts`  | `format-price.ts`   |
| Type file | `kebab-case.ts`  | `product.types.ts`  |
| Constant  | `kebab-case.ts`  | `site-config.ts`    |
| Page      | `page.tsx`       | Next.js convention  |
| Layout    | `layout.tsx`     | Next.js convention  |
| Mock data | `*.mock.ts`      | `products.mock.ts`  |

### Code:

| Loại             | Quy tắc            | Ví dụ                          |
| ---------------- | ------------------ | ------------------------------ |
| Component name   | `PascalCase`       | `ProductCard`                  |
| Function / hook  | `camelCase`        | `useCartStore`, `formatPrice`  |
| Constant         | `UPPER_SNAKE_CASE` | `SITE_CONFIG`, `MAX_PAGE_SIZE` |
| Type / Interface | `PascalCase`       | `Product`, `CartItem`          |
| Enum value       | `UPPER_SNAKE_CASE` | `OrderStatus.PENDING`          |
| CSS variable     | `--kebab-case`     | `--color-brand-500`            |
| Zustand store    | `use*Store`        | `useCartStore`                 |

---

## 6. Component Rules

### Server vs Client:

- **Mặc định là Server Component** — không thêm `"use client"` trừ khi cần
- Chỉ dùng `"use client"` khi component cần: `useState`, `useEffect`, event handler, browser API, Zustand, Framer Motion
- `"use client"` đặt ở component nhỏ nhất có thể — KHÔNG đặt ở layout hay page

### Cấu trúc component:

```tsx
// 1. Directive (nếu cần)
"use client";

// 2. Imports — theo thứ tự: external → internal → relative
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { ProductImage } from "./product-image";

// 3. Types
interface ProductCardProps {
  product: Product;
  className?: string;
}

// 4. Component
export function ProductCard({ product, className }: ProductCardProps) {
  return (/* ... */);
}
```

### Quy tắc:

- Props interface đặt ngay trên component, cùng file
- KHÔNG dùng `React.FC` — dùng function declaration
- KHÔNG dùng `default export` cho component — dùng named export
- `className` prop là optional, merge qua `cn()`
- KHÔNG inline style — dùng Tailwind classes
- KHÔNG đặt magic number / string — extract ra constant

---

## 7. State Management

### Zustand — chỉ cho UI state:

| Được dùng cho               | KHÔNG được dùng cho |
| --------------------------- | ------------------- |
| Cart state (client-side)    | Server data cache   |
| UI toggles (sidebar, modal) | Auth session        |
| Filter / sort preferences   | Database records    |
| Theme preference            | API response cache  |

### Quy tắc:

- Mỗi store một file trong `src/store/`
- Tên file: `use-*-store.ts`
- Store PHẢI có TypeScript interface đầy đủ
- Persist middleware chỉ dùng khi data cần giữ qua reload (cart, preferences)
- KHÔNG lưu derived state — tính trong component hoặc selector

---

## 8. Mock Data

Vì chưa có backend, mọi dữ liệu PHẢI là mock:

```
src/lib/mock-data/
├── products.mock.ts      # Danh sách sản phẩm
├── categories.mock.ts    # Danh mục
├── brands.mock.ts        # Thương hiệu
└── index.ts              # Barrel export
```

### Quy tắc:

- Mock data PHẢI conform với types trong `src/types/`
- Mock data PHẢI dùng `as const satisfies` khi có thể
- KHÔNG hardcode data trực tiếp trong component — import từ mock
- Mock data nên realistic (tên sản phẩm, giá, hình ảnh placeholder thật)
- Khi backend sẵn sàng: thay mock import bằng data fetching — component KHÔNG thay đổi

---

## 9. Styling

### Design Tokens (globals.css `@theme`):

- Brand palette: `--color-brand-50` → `--color-brand-900`
- Neutral palette: `--color-neutral-50` → `--color-neutral-900`
- Fonts: `--font-sans` (Inter), `--font-serif` (Playfair Display)

### Quy tắc:

- KHÔNG dùng màu arbitrary (`text-[#ff0000]`) — dùng token: `text-brand-500`
- KHÔNG dùng arbitrary spacing trừ khi Tailwind không có class phù hợp
- Responsive-first: mobile → `sm:` → `md:` → `lg:` → `xl:`
- Dark mode: chưa triển khai, KHÔNG thêm `dark:` classes
- Animation: dùng Framer Motion, KHÔNG dùng CSS animation tự viết trừ spinner/pulse

---

## 10. Import Rules

### Thứ tự import (ESLint auto-sort):

```
1. Built-in (react, next)
2. External packages
3. Internal absolute (@/components, @/lib, @/hooks…)
4. Relative (./component, ../utils)
```

### Quy tắc:

- LUÔN dùng absolute import: `@/components/ui/button`, KHÔNG `../../../components/ui/button`
- LUÔN dùng `type` import khi chỉ import type: `import type { Product } from "@/types"`
- KHÔNG import từ barrel (`@/components/ui`) nếu chỉ dùng 1 item — import trực tiếp file
- KHÔNG circular import — ESLint sẽ báo lỗi

---

## 11. Performance

- Images: dùng `next/image` với `width`, `height`, `alt` bắt buộc
- Fonts: dùng `next/font` — đã cấu hình Inter + Playfair Display
- Component lazy load: `next/dynamic` cho component nặng (editor, chart, map)
- KHÔNG import toàn bộ library: `import { motion } from "framer-motion"`, KHÔNG `import * as`
- `optimizePackageImports` đã bật cho: `lucide-react`, `framer-motion`, `@radix-ui/react-slot`

---

## 12. Error Handling

- Mỗi route group PHẢI có `error.tsx` boundary
- Mỗi route group PHẢI có `loading.tsx`
- Form validation dùng Zod — hiện lỗi inline, KHÔNG alert/console
- KHÔNG dùng `try/catch` trong component render — dùng Error Boundary

---

## 13. Git Conventions

### Branch:

```
feature/<tên>       — Tính năng mới
fix/<tên>           — Sửa lỗi
refactor/<tên>      — Tái cấu trúc
ui/<tên>            — Thay đổi giao diện
```

### Commit message (Conventional Commits):

```
feat: add product card component
fix: correct price formatting for VND
refactor: extract product grid to shared
ui: update brand color palette
chore: add eslint import ordering rule
```

### Pre-commit:

- `lint-staged` chạy tự động: ESLint fix + Prettier format
- KHÔNG commit code có TypeScript error
- KHÔNG commit code có ESLint error (warning OK nếu có lý do)

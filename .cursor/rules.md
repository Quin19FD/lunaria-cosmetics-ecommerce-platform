# Lunaria — AI / Cursor Rules

> Quy tắc bắt buộc khi sinh code cho dự án này.
> Đọc kỹ trước khi tạo hoặc chỉnh sửa bất kỳ file nào.

---

## Trạng thái dự án

Giai đoạn: **UI-ONLY** — chưa có backend, database, hoặc auth.

---

## DO — Bắt buộc tuân thủ

- ✅ Dùng TypeScript strict — không `any`, không `as` trừ khi cast Zod output
- ✅ Dùng Server Component mặc định — chỉ thêm `"use client"` khi cần interactivity
- ✅ Đẩy `"use client"` xuống component nhỏ nhất có thể
- ✅ Dùng named export cho mọi component — không `export default` (trừ page.tsx, layout.tsx)
- ✅ Dùng `cn()` từ `@/lib/utils` để merge className
- ✅ Dùng absolute import `@/...` — không relative path kiểu `../../`
- ✅ Dùng `type` import: `import type { X } from "..."`
- ✅ Dùng mock data từ `src/lib/mock-data/` — không hardcode data trong component
- ✅ Dùng design tokens (brand-_, neutral-_) — không arbitrary color values
- ✅ Dùng `next/image` với `width`, `height`, `alt` đầy đủ
- ✅ Thêm `loading.tsx` và `error.tsx` cho mỗi route group
- ✅ Component mới phải có typed props interface
- ✅ Responsive-first: viết mobile trước, thêm `sm:` `md:` `lg:` breakpoints
- ✅ Feature mới → tạo thư mục trong `src/features/<name>/`
- ✅ Component dùng chung ≥ 2 nơi → đặt trong `src/components/shared/`
- ✅ Atomic component (Button, Input…) → đặt trong `src/components/ui/`
- ✅ Zustand store cho UI state → file trong `src/store/use-*-store.ts`
- ✅ Animation dùng Framer Motion với `reducedMotion: "user"`
- ✅ Form validation dùng Zod

---

## DON'T — Tuyệt đối không làm

- ❌ **KHÔNG** tạo file trong `prisma/` — chưa có database
- ❌ **KHÔNG** tạo `src/lib/db.ts` hoặc import `@prisma/client`
- ❌ **KHÔNG** tạo Server Actions (`"use server"`)
- ❌ **KHÔNG** tạo Route Handlers (`app/api/...`)
- ❌ **KHÔNG** dùng `next-auth` hoặc bất kỳ auth library
- ❌ **KHÔNG** fetch API endpoint thật — dùng mock data
- ❌ **KHÔNG** cài dependency backend (bcrypt, jose, nodemailer…)
- ❌ **KHÔNG** viết business logic trong component — tách ra hook hoặc lib
- ❌ **KHÔNG** dùng `React.FC` — dùng function declaration
- ❌ **KHÔNG** dùng inline style — dùng Tailwind
- ❌ **KHÔNG** dùng `any` — define type cụ thể
- ❌ **KHÔNG** dùng `export default` cho component (trừ page/layout)
- ❌ **KHÔNG** import internal file của feature khác — dùng barrel export
- ❌ **KHÔNG** đặt component file trực tiếp trong `app/` — page.tsx chỉ compose
- ❌ **KHÔNG** tạo thư mục mới ở `src/` root
- ❌ **KHÔNG** dùng CSS modules hoặc styled-components
- ❌ **KHÔNG** dùng `dark:` classes — dark mode chưa triển khai
- ❌ **KHÔNG** dùng icon library nào ngoài Lucide React
- ❌ **KHÔNG** dùng `npm` hoặc `yarn` — chỉ `pnpm`

---

## Cấu trúc file component

```tsx
"use client"; // CHỈ khi cần

import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  // hooks
  // handlers
  // render
}
```

---

## Khi tạo feature mới

```
src/features/<feature-name>/
├── components/       # UI components riêng feature
├── hooks/            # Custom hooks riêng feature
├── types.ts          # Types riêng feature
└── index.ts          # Barrel export — API duy nhất cho bên ngoài
```

Rồi dùng trong page:

```tsx
// app/(storefront)/products/page.tsx
import { ProductGrid } from "@/features/products";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function ProductsPage() {
  return <ProductGrid products={MOCK_PRODUCTS} />;
}
```

---

## Khi tạo mock data

```typescript
// src/lib/mock-data/products.mock.ts
import type { Product } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    name: "Serum Vitamin C",
    slug: "serum-vitamin-c",
    price: 850000,
    // ...đầy đủ fields theo type
  },
];
```

---

## Design tokens — dùng chính xác

```
Màu brand:   text-brand-500, bg-brand-50, border-brand-200...
Màu neutral: text-neutral-900, bg-neutral-50, border-neutral-200...
Font:        font-sans (Inter), font-serif (Playfair Display)
```

Không dùng: `text-[#custom]`, `bg-[#custom]`, `text-gray-500`, `text-stone-500`

---

## Checklist trước khi submit code

1. `pnpm typecheck` — không error
2. `pnpm lint` — không error (warning chấp nhận được)
3. Component có typed props
4. Không import `@prisma/client`, `next-auth`, hoặc backend deps
5. Data đến từ mock hoặc props — không fetch API
6. `"use client"` chỉ ở component nhỏ nhất cần thiết
7. Responsive: test ở 375px, 768px, 1280px
8. Accessible: interactive elements có label, focusable, keyboard-navigable

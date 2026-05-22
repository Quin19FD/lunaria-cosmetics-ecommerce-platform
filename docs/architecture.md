# Lunaria — Kiến trúc hệ thống

---

## 1. Tổng quan

Lunaria là nền tảng ecommerce mỹ phẩm cao cấp, xây dựng trên Next.js 15 App Router.

Kiến trúc chia thành 3 layer rõ ràng. Giai đoạn hiện tại chỉ triển khai **Presentation Layer**.

```
┌─────────────────────────────────────────────┐
│            Presentation Layer               │  ← ĐANG XÂY DỰNG
│  Components, Pages, Layouts, Animations     │
├─────────────────────────────────────────────┤
│            Application Layer                │  ← SAU NÀY
│  Server Actions, Hooks, State, Validation   │
├─────────────────────────────────────────────┤
│            Data Layer                       │  ← SAU NÀY
│  Prisma, Database, Auth, External APIs      │
└─────────────────────────────────────────────┘
```

### Nguyên tắc phân tách:

- **Presentation** không biết data đến từ đâu — chỉ nhận props và render
- **Application** orchestrate logic, gọi data layer, transform cho presentation
- **Data** chỉ biết cách đọc/ghi — không biết UI

Lợi ích: khi thêm backend, chỉ thay data layer + thêm application logic. Component giữ nguyên.

---

## 2. App Router Strategy

### Route Groups

```
app/
├── (storefront)/          # Trang công khai — header/footer layout
│   ├── page.tsx           # Trang chủ
│   ├── products/          # Catalog
│   │   ├── page.tsx       # Product listing
│   │   └── [slug]/
│   │       └── page.tsx   # Product detail
│   ├── cart/
│   │   └── page.tsx       # Giỏ hàng
│   └── ...
│
├── (admin)/               # Admin dashboard — sidebar layout
│   └── admin/
│       ├── page.tsx       # Dashboard overview
│       ├── products/      # Quản lý sản phẩm
│       ├── orders/        # Quản lý đơn hàng
│       └── ...
│
├── (auth)/                # Xác thực — centered card layout
│   └── auth/
│       ├── login/
│       └── register/
│
├── layout.tsx             # Root layout: providers, fonts, metadata
└── globals.css            # Design tokens
```

### Quy tắc routing:

| Quy tắc                                           | Lý do                                    |
| ------------------------------------------------- | ---------------------------------------- |
| Mỗi route group có layout riêng                   | Layout khác nhau cho storefront vs admin |
| Mỗi route group có `error.tsx` + `loading.tsx`    | Error/loading boundary cô lập            |
| Page file CHỈ compose component, không chứa logic | Page là thin orchestrator                |
| Metadata export ở mỗi page cho SEO                | Mỗi trang cần title + description riêng  |

### Server vs Client boundary:

```
                    Server Component (default)
                    ┌──────────────────────────┐
                    │  page.tsx                 │
                    │  layout.tsx               │
                    │  ProductGrid              │
                    │  ProductDetail            │
                    └──────┬───────────────────┘
                           │ props
                    ┌──────▼───────────────────┐
                    │  "use client"             │
                    │  AddToCartButton          │
                    │  ProductImageGallery      │
                    │  SearchFilter             │
                    │  AnimatedSection          │
                    └──────────────────────────┘
```

Nguyên tắc: **push `"use client"` xuống sâu nhất có thể**. Page và layout LUÔN là Server Component.

---

## 3. Feature Module Architecture

Mỗi feature là đơn vị tự chứa, có thể phát triển độc lập:

```
features/
├── products/
│   ├── components/
│   │   ├── product-card.tsx         # Card hiển thị sản phẩm
│   │   ├── product-grid.tsx         # Grid layout
│   │   ├── product-detail.tsx       # Chi tiết sản phẩm
│   │   ├── product-image-gallery.tsx
│   │   └── product-filters.tsx
│   ├── hooks/
│   │   └── use-product-filter.ts
│   ├── types.ts
│   └── index.ts                     # Barrel: public API
│
├── cart/
│   ├── components/
│   │   ├── cart-sheet.tsx           # Slide-over cart
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── hooks/
│   │   └── use-cart-actions.ts
│   ├── types.ts
│   └── index.ts
│
├── search/
│   ├── components/
│   │   ├── search-dialog.tsx
│   │   └── search-results.tsx
│   ├── hooks/
│   │   └── use-search.ts
│   ├── types.ts
│   └── index.ts
│
└── admin/
    ├── components/
    │   ├── admin-sidebar.tsx
    │   ├── admin-header.tsx
    │   ├── stats-card.tsx
    │   └── data-table.tsx
    ├── types.ts
    └── index.ts
```

### Dependency Rules:

```
features/products/  ──→  components/ui/     ✅ OK
features/products/  ──→  components/shared/ ✅ OK
features/products/  ──→  hooks/             ✅ OK
features/products/  ──→  lib/               ✅ OK
features/products/  ──→  types/             ✅ OK
features/products/  ──→  store/             ✅ OK

features/products/  ──→  features/cart/components/cart-item.tsx  ❌ KHÔNG
features/products/  ──→  features/cart/     ✅ OK (qua barrel index.ts)
```

Nếu component dùng ở ≥ 2 features → chuyển ra `components/shared/`.

---

## 4. Component Hierarchy

```
Atomic (components/ui/)
│   Button, Input, Skeleton, Card, Badge, Avatar, Sheet, Dialog…
│   → shadcn/ui style, dùng CVA cho variants
│   → KHÔNG chứa business logic
│
├── Composite (components/shared/)
│   │   SiteHeader, SiteFooter, ProductCard, PriceDisplay, RatingStars…
│   │   → Compose từ atomic components
│   │   → Có thể nhận business data qua props
│   │
│   └── Feature (features/*/components/)
│           ProductGrid, CartSheet, AdminSidebar, SearchDialog…
│           → Chứa feature-specific logic
│           → Kết nối store, dùng hooks
│           → Chỉ dùng trong feature hoặc export qua barrel
```

---

## 5. Data Flow (giai đoạn UI-only)

```
Mock Data (lib/mock-data/)
       │
       ▼
Page (Server Component)
       │ import mock, pass as props
       ▼
Feature Component
       │ render UI, delegate interactivity
       ▼
Client Component ("use client")
       │ Zustand store cho local state
       ▼
UI Render
```

### Khi thêm backend (giai đoạn sau):

```
Database (Prisma)
       │
       ▼
Data Access (lib/data/)          ← THÊM MỚI
       │ db queries, transform
       ▼
Server Action / Route Handler    ← THÊM MỚI
       │
       ▼
Page (Server Component)
       │ await data, pass as props   ← THAY mock bằng real data
       ▼
Feature Component                ← KHÔNG ĐỔI
       │
       ▼
Client Component                 ← KHÔNG ĐỔI
```

Điểm mấu chốt: **Component layer không thay đổi khi thêm backend.** Chỉ thay nguồn data ở page level.

---

## 6. Shared Component Design

### Ví dụ: PriceDisplay

```tsx
// components/shared/price-display.tsx
// Dùng ở: ProductCard, CartItem, OrderSummary, AdminProductRow

interface PriceDisplayProps {
  amount: number; // Luôn là cents
  saleAmount?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}
```

### Nguyên tắc thiết kế shared component:

1. **Props-driven** — không tự fetch data, không dùng store trực tiếp
2. **Composable** — dùng `children`, `asChild`, hoặc render props khi cần flexibility
3. **Variant-aware** — dùng CVA nếu có ≥ 2 visual variants
4. **Accessible** — ARIA attributes, keyboard navigation, focus management
5. **Responsive** — mobile-first, không hardcode width

---

## 7. State Architecture

```
┌────────────────────────────────────────┐
│  URL State (searchParams)              │  Filters, pagination, sort
│  → Managed by Next.js router           │
│  → Server-readable, shareable, SEO     │
├────────────────────────────────────────┤
│  Zustand Stores (client)               │  Cart, UI toggles, preferences
│  → Persisted: cart, theme              │
│  → Ephemeral: sidebar open, modal      │
├────────────────────────────────────────┤
│  Component State (useState)            │  Form inputs, local toggles
│  → Không share ra ngoài component      │
│  → Reset khi unmount                   │
└────────────────────────────────────────┘
```

### Chọn đúng loại state:

| Cần share URL? | Cần persist? | Cần share cross-component? | → Dùng           |
| -------------- | ------------ | -------------------------- | ---------------- |
| ✅             | —            | —                          | URL searchParams |
| ❌             | ✅           | ✅                         | Zustand persist  |
| ❌             | ❌           | ✅                         | Zustand          |
| ❌             | ❌           | ❌                         | useState         |

---

## 8. Scaling Strategy

### Phase 1 — UI Foundation (HIỆN TẠI)

- Toàn bộ UI component + design system
- Mock data, Zustand cho cart/UI
- Responsive, accessible, animated
- Admin dashboard UI shell

### Phase 2 — Auth + Database

- Thêm Prisma schema + PostgreSQL
- NextAuth v5 (Credentials + OAuth)
- Thay mock data bằng real data ở page level
- Server Actions cho mutations

### Phase 3 — Commerce Logic

- Stripe/payment integration
- Order processing pipeline
- Inventory management
- Email notifications

### Phase 4 — Optimization

- Redis caching
- Image CDN (Cloudinary)
- Search (Meilisearch/Algolia)
- Analytics + monitoring

### Mỗi phase tuân thủ:

- Component layer KHÔNG thay đổi khi thêm data layer
- Feature module boundaries giữ nguyên
- Types là contract giữa các layer — define trước, implement sau

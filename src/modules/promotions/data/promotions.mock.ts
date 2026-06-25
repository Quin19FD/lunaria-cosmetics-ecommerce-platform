import type { FlashDeal, Promotion } from "../types";

export const PROMOTIONS_MOCK: Promotion[] = [
  {
    id: "promo_01",
    title: "Mùa Hè Rực Rỡ",
    subtitle: "Giảm đến 40% toàn bộ dòng chống nắng",
    code: "SUMMER40",
    discount: "40%",
    description:
      "Bảo vệ làn da khỏi tia UV với bộ sưu tập chống nắng cao cấp. Áp dụng cho tất cả sản phẩm SPF từ ngày 01/06 - 30/06.",
    endDate: "2025-06-30",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=500&fit=crop&q=80",
    color: "pink",
    productSlugs: [
      "kem-chong-nang-spf50",
      "serum-vitamin-c",
      "kem-duong-am-hyaluronic",
    ],
  },
  {
    id: "promo_02",
    title: "Flash Sale Nửa Đêm",
    subtitle: "Chỉ 6 tiếng — Giảm sốc 50%",
    code: "MIDNIGHT50",
    discount: "50%",
    description:
      "Đừng bỏ lỡ cơ hội sở hữu serum và kem dưỡng cao cấp với giá không tưởng. Flash sale từ 0h - 6h sáng.",
    endDate: "2025-06-15",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=500&fit=crop&q=80",
    color: "purple",
    productSlugs: [
      "serum-vitamin-c",
      "kem-duong-am-hyaluronic",
      "nuoc-tay-trang-diu-nhe",
    ],
  },
  {
    id: "promo_03",
    title: "Mua 2 Tặng 1",
    subtitle: "Áp dụng toàn bộ mặt nạ & toner",
    code: "BUY2GET1",
    discount: "Tặng 1",
    description:
      "Mua 2 sản phẩm bất kỳ trong danh mục mặt nạ và toner, nhận ngay 1 sản phẩm miễn phí có giá trị thấp nhất.",
    endDate: "2025-07-31",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=500&fit=crop&q=80",
    color: "emerald",
    productSlugs: [
      "nuoc-tay-trang-diu-nhe",
      "dau-goi-thao-duoc",
      "dau-xa-phuc-hoi",
      "nuoc-hoa-huong-nhai",
    ],
  },
  {
    id: "promo_04",
    title: "Combo Tiết Kiệm",
    subtitle: "Set dưỡng da 3 bước — Giảm 30%",
    code: "COMBO30",
    discount: "30%",
    description:
      "Combo dưỡng da hoàn hảo gồm sữa rửa mặt, toner và serum với giá ưu đãi đặc biệt.",
    endDate: "2025-08-15",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=500&fit=crop&q=80",
    color: "amber",
    productSlugs: [
      "nuoc-tay-trang-diu-nhe",
      "serum-vitamin-c",
      "kem-duong-am-hyaluronic",
    ],
  },
];

export const FLASH_DEALS_MOCK: FlashDeal[] = [
  {
    productSlug: "serum-vitamin-c",
    originalPrice: 450000,
    dealPrice: 225000,
    sold: 87,
    total: 100,
  },
  {
    productSlug: "nuoc-tay-trang-diu-nhe",
    originalPrice: 520000,
    dealPrice: 260000,
    sold: 64,
    total: 80,
  },
  {
    productSlug: "mascara-lam-day-mi",
    originalPrice: 420000,
    dealPrice: 252000,
    sold: 45,
    total: 60,
  },
  {
    productSlug: "dau-goi-thao-duoc",
    originalPrice: 650000,
    dealPrice: 325000,
    sold: 32,
    total: 50,
  },
  {
    productSlug: "nuoc-hoa-huong-nhai",
    originalPrice: 320000,
    dealPrice: 192000,
    sold: 71,
    total: 90,
  },
  {
    productSlug: "kem-chong-nang-spf50",
    originalPrice: 340000,
    dealPrice: 170000,
    sold: 55,
    total: 70,
  },
];

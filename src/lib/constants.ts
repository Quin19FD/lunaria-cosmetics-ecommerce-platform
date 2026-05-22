export const SITE_CONFIG = {
  name: "Lunaria Cosmetics",
  description: "Nền tảng mỹ phẩm cao cấp",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

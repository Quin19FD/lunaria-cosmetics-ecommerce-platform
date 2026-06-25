export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discount: string;
  description: string;
  endDate: string;
  image: string;
  color: "pink" | "purple" | "amber" | "emerald";
  productSlugs: string[];
}

export interface FlashDeal {
  productSlug: string;
  originalPrice: number;
  dealPrice: number;
  sold: number;
  total: number;
}

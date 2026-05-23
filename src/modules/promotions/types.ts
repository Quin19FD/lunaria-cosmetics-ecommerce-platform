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
  productIds: string[];
}

export interface FlashDeal {
  productId: string;
  originalPrice: number;
  dealPrice: number;
  sold: number;
  total: number;
}

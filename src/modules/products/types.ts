export type SkinType = "da-kho" | "da-dau" | "da-nhay-cam" | "da-thuong";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "bestseller" | "new" | "hot" | "sale";
  skinTypes: SkinType[];
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export type SortOption =
  | "popular"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export interface ProductFilters {
  category?: string;
  skinType?: SkinType;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
}

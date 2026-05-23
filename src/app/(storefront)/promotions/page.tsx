import type { Metadata } from "next";

import {
  FlashDeals,
  PromoCards,
  PromoHero,
  PromoNewsletter,
} from "@/features/promotions";

export const metadata: Metadata = {
  title: "Khuyến mãi",
  description: "Ưu đãi đặc biệt và Flash Deals từ Lunaria Beauty",
};

export default function PromotionsPage() {
  return (
    <>
      <PromoHero />
      <FlashDeals />
      <PromoCards />
      <PromoNewsletter />
    </>
  );
}

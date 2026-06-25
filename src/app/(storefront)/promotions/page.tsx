import type { Metadata } from "next";

import {
  FlashDeals,
  PromoCards,
  PromoHero,
  PromoNewsletter,
} from "@/features/promotions";
import { promotionService } from "@/modules/promotions";

export const metadata: Metadata = {
  title: "Khuyến mãi",
  description: "Ưu đãi đặc biệt và Flash Deals từ Lunaria Beauty",
};

export default async function PromotionsPage() {
  const deals = await promotionService.getFlashDeals();
  const promotions = await promotionService.getAll();

  return (
    <>
      <PromoHero />
      <FlashDeals deals={deals} />
      <PromoCards promotions={promotions} />
      <PromoNewsletter />
    </>
  );
}

import {
  BestSellers,
  FeaturedCategories,
  FlashSaleBar,
  HeroBanner,
  Newsletter,
  Testimonials,
} from "@/features/home";
import { catalogService } from "@/modules/catalog";
import { productService } from "@/modules/products";
import { testimonialService } from "@/modules/testimonials";

export default async function HomePage() {
  const [categories, bestSellers, testimonials] = await Promise.all([
    catalogService.getFeaturedCategories(),
    productService.getBestSellers(),
    testimonialService.getFeatured(),
  ]);

  return (
    <>
      <HeroBanner />
      <FlashSaleBar />
      <FeaturedCategories categories={categories} />
      <BestSellers products={bestSellers} />
      <Testimonials testimonials={testimonials} />
      <Newsletter />
    </>
  );
}

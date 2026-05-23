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

export default function HomePage() {
  const categories = catalogService.getFeaturedCategories();
  const bestSellers = productService.getBestSellers();
  const testimonials = testimonialService.getFeatured();

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

import { TESTIMONIALS_MOCK } from "../data/testimonials.mock";
import type { Testimonial } from "../types";


export const testimonialService = {
  getAll(): Testimonial[] {
    return TESTIMONIALS_MOCK;
  },

  getFeatured(limit = 3): Testimonial[] {
    return TESTIMONIALS_MOCK.slice(0, limit);
  },
};

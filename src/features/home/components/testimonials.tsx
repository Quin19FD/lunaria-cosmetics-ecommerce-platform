import { Star } from "lucide-react";
import Image from "next/image";

import type { Testimonial } from "@/modules/testimonials"

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-neutral-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="font-serif text-2xl font-bold text-center text-neutral-900 sm:text-3xl">
          Khách Hàng Nói Gì?
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-center text-neutral-500">
          Hơn 50.000 phụ nữ đã tin dùng Lunaria Beauty
        </p>

        {/* Testimonial Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 flex-grow italic text-neutral-600">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Avatar, Name, and Title */}
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-neutral-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

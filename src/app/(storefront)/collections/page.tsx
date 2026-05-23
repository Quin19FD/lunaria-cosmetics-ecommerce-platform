import type { Metadata } from "next";

import { CollectionCard, CollectionsCta } from "@/features/collections";
import { collectionService } from "@/modules/collections";

export const metadata: Metadata = {
  title: "Bộ sưu tập",
  description: "Khám phá những bộ sưu tập mỹ phẩm cao cấp từ Lunaria Beauty",
};

export default function CollectionsPage() {
  const collections = collectionService.getAll();

  return (
    <>
      {/* Page header */}
      <section className="py-12 text-center lg:py-16">
        <h1 className="font-serif text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
          Tầm Nhìn Nghệ Thuật
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base">
          Khám phá những câu chuyện mỹ phẩm được biên soạn tỉ mỉ, nơi khoa học
          gặp vẻ đẹp thanh khiết của thế giới tự nhiên.
        </p>
      </section>

      {/* Collection cards — zigzag layout */}
      <section className="mx-auto max-w-7xl space-y-16 px-4 pb-16 sm:px-6 lg:space-y-24 lg:px-8 lg:pb-24">
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </section>

      {/* Bottom CTA */}
      <CollectionsCta />
    </>
  );
}

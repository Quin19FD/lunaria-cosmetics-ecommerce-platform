import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionHero, CollectionProducts } from "@/features/collections";
import { collectionService } from "@/modules/collections";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = collectionService.getBySlug(slug);
  if (!collection) return { title: "Bộ sưu tập không tìm thấy" };

  return {
    title: `${collection.name} — Bộ sưu tập`,
    description: collection.description[0],
  };
}

export function generateStaticParams() {
  return collectionService.getAll().map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = collectionService.getBySlug(slug);
  if (!collection) notFound();

  const { data: products, total } = await collectionService.getProducts(
    collection,
    1,
  );

  return (
    <>
      <CollectionHero collection={collection} />
      <CollectionProducts products={products} total={total} />
    </>
  );
}

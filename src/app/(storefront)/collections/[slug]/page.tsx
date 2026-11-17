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
  const collection = await collectionService.getBySlug(slug);
  if (!collection) return { title: "Bộ sưu tập không tìm thấy" };

  const path = `/collections/${collection.slug}`;
  return {
    title: `${collection.name} — Bộ sưu tập`,
    description: collection.description[0],
    alternates: { canonical: path },
    openGraph: {
      title: collection.name,
      description: collection.description[0],
      url: path,
      images: [{ url: collection.heroImage, alt: collection.name }],
    },
  };
}

export async function generateStaticParams() {
  const collections = await collectionService.getAll();
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = await collectionService.getBySlug(slug);
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

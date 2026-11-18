import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findInfoPage, INFO_PAGES } from "@/features/info/pages";

// Only the slugs listed in INFO_PAGES exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return INFO_PAGES.map((page) => ({ slug: page.slug }));
}

interface InfoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: InfoPageProps): Promise<Metadata> {
  const page = findInfoPage((await params).slug);
  return page ? { title: page.title, description: page.summary } : {};
}

export default async function InfoPage({ params }: InfoPageProps) {
  const page = findInfoPage((await params).slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-serif text-3xl font-bold text-neutral-900">
        {page.title}
      </h1>
      <p className="mt-3 text-neutral-600">{page.summary}</p>
      {page.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-neutral-900">
            {section.heading}
          </h2>
          <p className="mt-2 leading-relaxed text-neutral-600">
            {section.body}
          </p>
        </section>
      ))}
    </article>
  );
}

import { notFound } from 'next/navigation';
import BlockRenderer from '../../components/BlockRenderer';
import { getPageBySlug } from '../../lib/api';

export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page) return {};
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || undefined,
    openGraph: page.seo?.ogImage ? { images: [page.seo.ogImage] } : undefined,
  };
}

export default async function DynamicPage({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <article className="py-16">
      <BlockRenderer blocks={page.blocks} />
    </article>
  );
}

import { notFound } from 'next/navigation';
import BlockRenderer from '../components/BlockRenderer';
import { getPageBySlug } from '../lib/api';

// The homepage is just the published page whose slug is "home" — no
// hardcoded content, same rendering path as every other CMS-managed page.
export default async function HomePage() {
  const page = await getPageBySlug('home');
  if (!page) notFound();
  return <BlockRenderer blocks={page.blocks} />;
}

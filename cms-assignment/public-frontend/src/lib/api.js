// Server-side fetch helper for the public site. Next.js's fetch cache
// (`next: { revalidate }`) does the "don't hammer the API on every request"
// job here — plain axios wouldn't get that for free in Server Components.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

async function apiGet(path, { revalidate = 60 } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API request failed: ${res.status} ${path}`);
  const json = await res.json();
  return json.data;
}

export const getPageBySlug = (slug) => apiGet(`/public/pages/${slug}`);
export const listPublicPages = () => apiGet('/public/pages');
export const getSettings = () => apiGet('/public/settings', { revalidate: 300 });

export { API_BASE_URL };

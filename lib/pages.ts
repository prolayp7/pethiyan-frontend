import { API_BASE } from './api';

export async function fetchPageBySlug(slug: string) {
  const url = `${API_BASE.replace(/\/+$/, '')}/admin/api/pages/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { next: { tags: ['pages'] } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch page ${slug}: ${res.status}`);
  return res.json();
}

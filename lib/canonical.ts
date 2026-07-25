// Central helper for building self-referencing canonical paths.
//
// Canonicals in this app are always constructed from clean, app-resolved
// data (a slug, a validated page number) — never from the raw incoming
// request URL — so tracking params (utm_*, gclid, fbclid, ...) can never
// leak in. TRACKING_PARAMS below is a defensive filter in case a caller
// ever passes through raw searchParams.
const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ref",
  "affiliate",
  "source",
  "session",
]);

/**
 * Build a clean, self-referencing canonical path (relative — resolved against
 * `metadataBase` by the Next.js Metadata API).
 *
 * @param pathname - route path, e.g. "/blog/category/foo"
 * @param preserveParams - query params to keep on the canonical (e.g. pagination).
 *   Tracking params are stripped even if present; empty/undefined values are dropped.
 */
export function buildCanonicalPath(
  pathname: string,
  preserveParams?: Record<string, string | undefined>,
): string {
  const segments = pathname.split("/").filter(Boolean);
  const base = `/${segments.join("/")}`;

  if (!preserveParams) return base;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(preserveParams)) {
    if (TRACKING_PARAMS.has(key)) continue;
    if (value === undefined || value === "") continue;
    params.set(key, value);
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

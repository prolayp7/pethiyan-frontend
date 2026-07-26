// Canonical storefront origin — single source of truth for every
// canonical/sitemap/robots/OG/JSON-LD URL builder in this app.
// Falls back to the production canonical host if the env var is unset.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pethiyan.com";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

/**
 * Normalize an admin-entered URL/path into a safe relative path.
 * Canonicals in this app are always relative (resolved against
 * metadataBase), so this strips any host an operator might paste in
 * — including a stale www/http one — rather than trusting it.
 */
export function normalizeCanonicalInput(input: string | null | undefined): string {
  const value = (input ?? "").trim();
  if (!value) return "/";

  try {
    const url = new URL(value);
    const path = url.pathname || "/";
    return url.search ? `${path}${url.search}` : path;
  } catch {
    return value.startsWith("/") ? value : `/${value}`;
  }
}

/**
 * Force an admin-entered URL/path onto the canonical SITE_URL origin,
 * regardless of what host (if any) was entered.
 */
export function toCanonicalAbsoluteUrl(input: string | null | undefined): string {
  return `${SITE_URL}${normalizeCanonicalInput(input)}`;
}

import type { Metadata } from "next";
import { getNewArrivals, type RealApiProduct } from "@/lib/api";
import NewArrivalsClient from "./NewArrivalsClient";

// Google flags an "index, follow" page whose body says "No products found"
// as a Soft 404. Widen the lookback window when a short one comes back
// empty (e.g. a slow week for new SKUs) so the page has something to show;
// Next.js dedupes these identical fetches across generateMetadata + the page.
const FALLBACK_WINDOWS = [30, 90, 180, 365];

async function fetchNewArrivals(limit: number): Promise<RealApiProduct[]> {
  for (const days of FALLBACK_WINDOWS) {
    const products = (await getNewArrivals(days, limit)) as RealApiProduct[];
    if (products.length > 0) return products;
  }
  return [];
}

export async function generateMetadata(): Promise<Metadata> {
  const products = await fetchNewArrivals(40);
  const isEmpty = products.length === 0;

  return {
    title: "New Arrivals | Pethiyan",
    description: "Discover the latest additions to our packaging collection — fresh pouches, bags, tapes, and more.",
    alternates: { canonical: "/new-arrivals" },
    // Safety net for the rare case where even the widest window is empty —
    // don't let Google index a thin/empty listing.
    robots: isEmpty
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

// Fallback revalidation every 5 minutes; primary invalidation via POST /api/revalidate
export const revalidate = 300;

export default async function NewArrivalsPage() {
  const products = await fetchNewArrivals(40);

  return <NewArrivalsClient initialProducts={products} />;
}

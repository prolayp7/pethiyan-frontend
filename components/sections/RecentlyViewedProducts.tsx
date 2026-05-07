"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { getProductsByIds, type RealApiProduct } from "@/lib/api";
import { clearRecentlyViewedIds, readRecentlyViewedIds } from "@/lib/recently-viewed";

// ─── Skeleton — reserves layout space while products are loading ──────────────
// Matches the section's exact outer wrapper + grid so the footer never shifts.
function RecentlyViewedSkeleton() {
  return (
    <section
      className="border-t border-(--color-border) bg-white py-14"
      aria-hidden="true"
    >
      <Container>
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-3 w-28 rounded-full bg-gray-100 animate-pulse mb-3" />
          <div className="h-7 w-52 rounded-full bg-gray-100 animate-pulse mb-3" />
          <div className="h-4 max-w-lg w-full rounded-full bg-gray-100 animate-pulse" />
        </div>

        {/* Desktop 4-col grid skeleton */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse mt-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile single card skeleton */}
        <div className="sm:hidden rounded-2xl overflow-hidden border border-gray-100">
          <div className="aspect-square bg-gray-100 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-3 w-3/4 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
      </Container>
    </section>
  );
}

interface RecentlyViewedProductsProps {
  excludeProductId?: number;
  title?: string;
  eyebrow?: string;
  description?: string;
  maxItems?: number;
  viewAllHref?: string;
  viewAllLabel?: string;
  showClearAction?: boolean;
}

export default function RecentlyViewedProducts({
  excludeProductId,
  title = "Recently Viewed",
  eyebrow = "Continue browsing",
  description = "Jump back into the packaging options you explored most recently.",
  maxItems = 4,
  viewAllHref = "/shop",
  viewAllLabel = "Browse all",
  showClearAction = true,
}: RecentlyViewedProductsProps) {
  const [products, setProducts] = useState<RealApiProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);

  function scrollSlider(direction: "prev" | "next") {
    const el = mobileSliderRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-rv-slide]");
    const gap = 20;
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.82;
    el.scrollBy({ left: direction === "next" ? cardWidth + gap : -(cardWidth + gap), behavior: "smooth" });
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const requestedIds = readRecentlyViewedIds()
        .filter((id) => id !== excludeProductId)
        .slice(0, maxItems);

      if (requestedIds.length === 0) {
        if (!cancelled) {
          setProducts([]);
          setLoaded(true);
        }
        return;
      }

      const items = await getProductsByIds(requestedIds);
      if (!cancelled) {
        setProducts(items.slice(0, maxItems));
        setLoaded(true);
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [excludeProductId, maxItems]);

  // Reserve layout space while loading — prevents the footer shifting when
  // products eventually appear. Only suppress permanently once confirmed empty.
  if (!loaded) return <RecentlyViewedSkeleton />;
  if (products.length === 0) return null;

  return (
    <section
      className="border-t border-(--color-border) bg-white py-14"
      aria-labelledby="recently-viewed-heading"
    >
      <Container>
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-(--color-primary)">
              {eyebrow}
            </p>
            <h2
              id="recently-viewed-heading"
              className="text-2xl font-extrabold text-(--color-secondary) sm:text-3xl"
            >
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              {description}
            </p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            {showClearAction && (
              <button
                type="button"
                onClick={() => {
                  clearRecentlyViewedIds();
                  setProducts([]);
                  setLoaded(true);
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-(--color-primary)"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear
              </button>
            )}
            <Link
              href={viewAllHref}
              className="flex items-center gap-1.5 text-sm font-semibold text-(--color-primary) transition-all hover:gap-2.5"
            >
              {viewAllLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="overflow-hidden sm:hidden">
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollSlider("prev")}
              aria-label="Scroll left"
              className="absolute left-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("next")}
              aria-label="Scroll right"
              className="absolute right-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <div
              ref={mobileSliderRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-12 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Recently viewed products slider"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  data-rv-slide
                  className="w-[85%] max-w-[320px] shrink-0 snap-start"
                >
                  <ShopProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <div className="flex flex-col items-center gap-3">
            {showClearAction && (
              <button
                type="button"
                onClick={() => {
                  clearRecentlyViewedIds();
                  setProducts([]);
                  setLoaded(true);
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-(--color-primary)"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear Recently Viewed
              </button>
            )}
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 rounded-full border-2 border-(--color-primary) px-6 py-2.5 text-sm font-semibold text-(--color-primary) transition-all hover:bg-(--color-primary) hover:text-white"
            >
              {viewAllLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

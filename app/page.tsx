import { Fragment } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { preload } from "react-dom";
import { getCategories, getFeaturedProductsSection, getHeroSection, getNewsletterSection, getPromoBannerSection, getSocialProofSection, getVideoStorySection, getWebSettings, getWhyChooseUsSection, type HomeSectionPlacement } from "@/lib/api";
import HeroSection10 from "@/components/hero/HeroSection10";
import CategoryGrid from "@/components/sections/CategoryGrid";
import VideoCarouselGrid from "@/components/sections/VideoCarouselGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import RecentlyViewedProducts from "@/components/sections/RecentlyViewedProducts";
import YourItems from "@/components/sections/YourItems";
import PromoBanner from "@/components/sections/PromoBanner";
import BrandStory from "@/components/sections/BrandStory";
import Testimonials from "@/components/sections/Testimonials";
import NewsletterSection from "@/components/sections/NewsletterSection";
import RecentBlogsSection from "@/components/sections/RecentBlogsSection";

type MovableSectionId = "video_stories" | "why_choose_us" | "promo_banner" | "social_proof" | "newsletter";
type SectionAnchor = "hero" | "categories" | "featured_products" | "your_items" | "recently_viewed" | MovableSectionId;

const ANCHOR_TO_PLACEMENT: Record<SectionAnchor, HomeSectionPlacement> = {
  hero: "after_hero",
  categories: "after_categories",
  featured_products: "after_featured_products",
  your_items: "after_your_items",
  recently_viewed: "after_recently_viewed",
  video_stories: "after_video_stories",
  why_choose_us: "after_why_choose_us",
  promo_banner: "after_promo_banner",
  social_proof: "after_social_proof",
  newsletter: "after_newsletter",
};

const MOVABLE_SECTION_ORDER: MovableSectionId[] = [
  "video_stories",
  "why_choose_us",
  "promo_banner",
  "social_proof",
  "newsletter",
];

const DEFAULT_TITLE = "Pethiyan — The Power of Perfect Packaging";
const DEFAULT_DESCRIPTION =
  "Shop premium packaging products — pouches, jars, ziplock bags, and custom packaging for modern brands. GST invoice, fast shipping across India.";

export async function generateMetadata(): Promise<Metadata> {
  const web = await getWebSettings().catch(() => null);

  const title       = web?.metaTitle       || DEFAULT_TITLE;
  const description = web?.metaDescription || DEFAULT_DESCRIPTION;
  const keywords    = web?.metaKeywords    || undefined;
  const canonical   = web?.metaCanonicalUrl || "/";
  const ogTitle     = web?.ogTitle         || title;
  const ogDesc      = web?.ogDescription   || description;
  const ogImage     = web?.ogImage         || "/images/banners/1.jpg";
  const twTitle     = web?.twitterTitle    || ogTitle;
  const twDesc      = web?.twitterDescription || ogDesc;
  const twImage     = web?.twitterImage    || ogImage;
  const twCard      = (web?.twitterCard as "summary" | "summary_large_image" | "app" | "player") || "summary_large_image";

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: twCard,
      title: twTitle,
      description: twDesc,
      images: [twImage],
    },
  };
}

/** Caps any server-side fetch at `ms` ms; returns `fallback` on timeout or error. */
function withTimeout<T>(p: Promise<T>, fallback: T, ms = 5000): Promise<T> {
  return Promise.race([
    p.catch(() => fallback),
    new Promise<T>((res) => setTimeout(() => res(fallback), ms)),
  ]);
}

export default async function HomePage() {
  // Read recently-viewed cookie server-side so the RecentlyViewedProducts component
  // renders identically on SSR and client hydration — eliminates the 0.216 footer CLS.
  const cookieStore = await cookies();
  const rvCookieStr = cookieStore.get("recently_viewed_ids")?.value;
  const initialRecentlyViewedIds = rvCookieStr
    ? decodeURIComponent(rvCookieStr).split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 10)
    : [];

  // Kick off ALL fetches in parallel immediately so nothing waits serially.
  // We await heroData first (separately) only to inject the LCP preload hint
  // as early as possible — all other fetches are already running in the background.
  const heroDataPromise          = withTimeout(getHeroSection(), null);
  const featuredPromise          = withTimeout(getFeaturedProductsSection(), null);
  const categoriesPromise        = withTimeout(getCategories(), []);
  const videoStoryPromise        = withTimeout(getVideoStorySection(), null);
  const whyChooseUsPromise       = withTimeout(getWhyChooseUsSection(), null);
  const promoBannerPromise       = withTimeout(getPromoBannerSection(), null);
  const socialProofPromise       = withTimeout(getSocialProofSection(), null);
  const newsletterPromise        = withTimeout(getNewsletterSection(), null);

  // Resolve hero data first so we can preload the LCP image into <head>
  // before the rest of the page body is rendered. This moves the image
  // fetch from 1,700 ms (body parse) to ~0 ms (head parse), improving LCP.
  const heroData = await heroDataPromise;
  const heroFirstImage = heroData?.slides?.filter((s) => s.image)?.[0]?.image;
  if (heroFirstImage) {
    const enc = encodeURIComponent(heroFirstImage);
    preload(`/_next/image?url=${enc}&w=1080&q=75`, {
      as: "image",
      fetchPriority: "high",
      // imageSrcSet mirrors what <Image fill sizes="…"> generates so the
      // browser's preload and the actual <img> request resolve from the same
      // cache entry — no double-fetch.
      imageSrcSet: [640, 750, 828, 1080, 1200, 1920]
        .map((w) => `/_next/image?url=${enc}&w=${w}&q=75 ${w}w`)
        .join(", "),
      imageSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 48vw",
    });
  }

  // Wait for all remaining fetches (already in flight since the top of the fn)
  const [featuredProductsSection, categories, videoStorySection, whyChooseUsSection, promoBannerSection, socialProofSection, newsletterSection] = await Promise.all([
    featuredPromise,
    categoriesPromise,
    videoStoryPromise,
    whyChooseUsPromise,
    promoBannerPromise,
    socialProofPromise,
    newsletterPromise,
  ]);

  const sectionPlacements: Record<MovableSectionId, HomeSectionPlacement> = {
    video_stories: videoStorySection?.settings?.placement ?? "after_recently_viewed",
    why_choose_us: whyChooseUsSection?.placement ?? "after_video_stories",
    promo_banner: promoBannerSection?.placement ?? "after_why_choose_us",
    social_proof: socialProofSection?.placement ?? "after_promo_banner",
    newsletter: newsletterSection?.placement ?? "after_social_proof",
  };

  const renderedSections = new Set<MovableSectionId>();

  const renderSectionsAfter = (anchor: SectionAnchor): React.ReactNode[] => {
    const placement = ANCHOR_TO_PLACEMENT[anchor];

    return MOVABLE_SECTION_ORDER.flatMap((sectionId) => {
      if (renderedSections.has(sectionId) || sectionPlacements[sectionId] !== placement) {
        return [];
      }

      renderedSections.add(sectionId);

      let sectionNode: React.ReactNode = null;

      switch (sectionId) {
        case "video_stories":
          sectionNode = <VideoCarouselGrid data={videoStorySection} />;
          break;
        case "why_choose_us":
          sectionNode = <BrandStory section={whyChooseUsSection} />;
          break;
        case "promo_banner":
          sectionNode = <PromoBanner section={promoBannerSection} />;
          break;
        case "social_proof":
          sectionNode = <Testimonials section={socialProofSection} />;
          break;
        case "newsletter":
          sectionNode = <NewsletterSection section={newsletterSection} />;
          break;
      }

      return [
        <Fragment key={sectionId}>
          {sectionNode}
          {renderSectionsAfter(sectionId)}
        </Fragment>,
      ];
    });
  };

  return (
    <>
      <HeroSection10
        slides={heroData?.slides}
        badges={heroData?.badges}
        settings={heroData?.settings}
      />
      {renderSectionsAfter("hero")}
      {/* <TrustBadges /> */}
      <CategoryGrid categories={categories} />
      {renderSectionsAfter("categories")}
      <FeaturedProducts section={featuredProductsSection} />
      {renderSectionsAfter("featured_products")}
      <YourItems />
      {renderSectionsAfter("your_items")}
      <RecentlyViewedProducts
        title="Pick Up Where You Left Off"
        eyebrow="Your recent views"
        description="The products you checked out most recently are waiting here for a faster return."
        viewAllLabel="Explore catalog"
        initialIds={initialRecentlyViewedIds}
      />
      {renderSectionsAfter("recently_viewed")}

      <RecentBlogsSection />

      {/* Extra padding for mobile bottom nav */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
}

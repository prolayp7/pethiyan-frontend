import type { Metadata } from "next";
import { getProductsPage, getCategories, getSubCategories } from "@/lib/api";
import type { ApiShopPage } from "@/lib/api";
import { fetchPageBySlug } from "@/lib/pages";
import {
  breadcrumbSchema,
  shopCollectionPageSchema,
  shopFaqPageSchema,
  jsonLd,
} from "@/lib/structured-data";
import { getCustomJsonLdSchemas, resolveShopSeo } from "@/lib/seo";
import ShopClient from "./ShopClient";

// Safety fallback: revalidate every hour even if webhook never fires.
// Primary invalidation is on-demand via POST /api/revalidate from the backend.
export const revalidate = 3600;

async function getShopPage(): Promise<ApiShopPage | null> {
  try {
    return await fetchPageBySlug("shop");
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const shopPage = await getShopPage();
  const seo = resolveShopSeo(shopPage);

  return {
    title: seo.title,
    description: seo.description,
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    alternates: { canonical: "/shop" },
    openGraph: {
      title: seo.openGraphTitle,
      description: seo.openGraphDescription,
      url: "/shop",
      ...(seo.openGraphImage ? { images: [{ url: seo.openGraphImage, alt: seo.openGraphImageAlt }] } : {}),
    },
    twitter: {
      card: seo.twitterCard,
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      ...(seo.twitterImage ? { images: [seo.twitterImage] } : {}),
    },
  };
}

export default async function ShopPage() {
  const [firstPage, categories, subCategories, shopPage] = await Promise.all([
    getProductsPage(1, 24),
    getCategories(),
    getSubCategories(),
    getShopPage(),
  ]);

  const seo = resolveShopSeo(shopPage);
  const bcSchema = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ]);
  const customSchemas = getCustomJsonLdSchemas(shopPage?.schema_mode, shopPage?.schema_json_ld);
  const autoSchemas =
    customSchemas.length > 0
      ? []
      : [shopCollectionPageSchema(seo.description, firstPage.products), bcSchema];
  const faqSchema = shopFaqPageSchema(shopPage);

  return (
    <>
      {autoSchemas.map((schema, index) => (
        <script {...jsonLd(schema)} key={`shop-schema-${index}`} />
      ))}
      {customSchemas.map((schema, index) => (
        <script {...jsonLd(schema as Record<string, unknown>)} key={`shop-custom-schema-${index}`} />
      ))}
      {faqSchema && <script {...jsonLd(faqSchema)} key="shop-faq-schema" />}
      <ShopClient
        initialProducts={firstPage.products}
        initialCategories={categories}
        initialSubCategories={subCategories}
        initialPage={firstPage.currentPage}
        initialHasMore={firstPage.hasMore}
        headerTitle={shopPage?.header_title ?? null}
        pageContent={shopPage?.page_content ?? null}
        faqs={shopPage?.faqs ?? []}
      />
    </>
  );
}

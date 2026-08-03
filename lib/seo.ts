import type { ApiCategory, ApiShopPage, RealApiProduct, RealApiVariant } from "./api";

const SITE_NAME = "Pethiyan";

type SchemaMode = "auto" | "custom" | null | undefined;
type ProductSeoKey =
  | "seo_title"
  | "seo_description"
  | "seo_keywords"
  | "og_title"
  | "og_description"
  | "og_image"
  | "twitter_title"
  | "twitter_description"
  | "twitter_card"
  | "twitter_image"
  | "schema_mode"
  | "schema_json_ld";
type VariantSeoKey = ProductSeoKey;

export interface ResolvedSeo {
  title: string;
  description: string;
  keywords?: string;
  indexable: boolean;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage?: string;
  openGraphImageAlt?: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage?: string;
  twitterCard: "summary" | "summary_large_image" | "app" | "player";
  schemaMode: SchemaMode;
  schemaJsonLd?: string | null;
}

function cleanText(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function resolveTwitterCard(value?: string | null, image?: string) {
  if (value === "summary" || value === "summary_large_image" || value === "app" || value === "player") {
    return value;
  }

  return image ? "summary_large_image" : "summary";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseJsonLdObject(value?: string | null): Record<string, unknown> | null {
  const raw = cleanText(value);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parseJsonLd(value?: string | null): unknown[] {
  const raw = cleanText(value);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(isPlainObject);
    }

    return isPlainObject(parsed) ? [parsed] : [];
  } catch {
    return [];
  }
}

export function getCustomJsonLdSchemas(schemaMode?: SchemaMode, schemaJsonLd?: string | null) {
  if (schemaMode !== "custom") return [];
  return parseJsonLd(schemaJsonLd);
}

export function resolveCategorySeo(category: ApiCategory): ResolvedSeo {
  const rawTitle = cleanText(category.name) ?? "Category";
  const title = cleanText(category.seo_title) ?? `${rawTitle} Packaging Products`;
  const description =
    cleanText(category.seo_description) ??
    `Shop ${rawTitle} packaging products at ${SITE_NAME} - premium quality, GST invoice, fast delivery across India.`;
  const image = cleanText(category.og_image) ?? cleanText(category.image);
  const openGraphImageAlt = cleanText(category.og_image_alt) ?? rawTitle;
  const openGraphTitle = cleanText(category.og_title) ?? title;
  const openGraphDescription = cleanText(category.og_description) ?? description;
  const twitterImage = cleanText(category.twitter_image) ?? image;
  const twitterTitle = cleanText(category.twitter_title) ?? openGraphTitle;
  const twitterDescription =
    cleanText(category.twitter_description) ?? openGraphDescription;

  return {
    title,
    description,
    keywords: cleanText(category.seo_keywords),
    indexable: category.is_indexable !== false,
    openGraphTitle,
    openGraphDescription,
    openGraphImage: image,
    openGraphImageAlt,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard: resolveTwitterCard(category.twitter_card, twitterImage),
    schemaMode: category.schema_mode,
    schemaJsonLd: category.schema_json_ld,
  };
}

const SHOP_DEFAULT_TITLE = "Shop All Products | Pethiyan";
const SHOP_DEFAULT_DESCRIPTION =
  "Browse our full range of premium packaging products — pouches, jars, corrugated boxes, courier bags, and adhesive tapes.";

export function resolveShopSeo(page?: ApiShopPage | null): ResolvedSeo {
  const title = cleanText(page?.seo_title) ?? SHOP_DEFAULT_TITLE;
  const description = cleanText(page?.seo_description) ?? SHOP_DEFAULT_DESCRIPTION;
  const image = cleanText(page?.og_image);
  const openGraphImageAlt = cleanText(page?.og_image_alt) ?? "Pethiyan packaging products";
  const openGraphTitle = cleanText(page?.og_title) ?? title;
  const openGraphDescription = cleanText(page?.og_description) ?? description;
  const twitterImage = cleanText(page?.twitter_image) ?? image;
  const twitterTitle = cleanText(page?.twitter_title) ?? openGraphTitle;
  const twitterDescription = cleanText(page?.twitter_description) ?? openGraphDescription;

  return {
    title,
    description,
    keywords: cleanText(page?.seo_keywords),
    indexable: true,
    openGraphTitle,
    openGraphDescription,
    openGraphImage: image,
    openGraphImageAlt,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard: resolveTwitterCard(page?.twitter_card, twitterImage),
    schemaMode: page?.schema_mode,
    schemaJsonLd: page?.schema_json_ld,
  };
}

function productFeature(product: RealApiProduct, key: ProductSeoKey) {
  const metadata = product.features?.metadata;
  const metadataValue = metadata?.[key];
  if (metadataValue !== undefined && metadataValue !== null) return metadataValue;
  return product.features?.[key];
}

function variantField(variant: RealApiVariant, key: VariantSeoKey) {
  const metadata = variant.metadata;
  const metadataValue = metadata?.[key];
  if (metadataValue !== undefined && metadataValue !== null) return metadataValue;
  return variant[key];
}

export function resolveProductSeo(product: RealApiProduct): ResolvedSeo {
  const rawTitle = cleanText(product.title) ?? "Product";
  const title = cleanText(productFeature(product, "seo_title")) ?? rawTitle;
  const description =
    cleanText(productFeature(product, "seo_description")) ??
    cleanText(product.short_description) ??
    cleanText(product.description) ??
    `Buy ${rawTitle} online at ${SITE_NAME}. Premium packaging with GST invoice and fast shipping across India.`;
  const image =
    cleanText(productFeature(product, "og_image")) ??
    cleanText(product.images?.main_image) ??
    cleanText(product.images?.all?.[0]);
  const openGraphTitle = cleanText(productFeature(product, "og_title")) ?? title;
  const openGraphDescription =
    cleanText(productFeature(product, "og_description")) ?? description;
  const twitterImage = cleanText(productFeature(product, "twitter_image")) ?? image;
  const twitterTitle = cleanText(productFeature(product, "twitter_title")) ?? openGraphTitle;
  const twitterDescription =
    cleanText(productFeature(product, "twitter_description")) ?? openGraphDescription;

  return {
    title,
    description,
    keywords: cleanText(productFeature(product, "seo_keywords")),
    indexable: product.features?.is_indexable !== false,
    openGraphTitle,
    openGraphDescription,
    openGraphImage: image,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard: resolveTwitterCard(productFeature(product, "twitter_card"), twitterImage),
    schemaMode: productFeature(product, "schema_mode") as SchemaMode,
    schemaJsonLd: cleanText(productFeature(product, "schema_json_ld")) ?? null,
  };
}

export function resolveVariantSeo(product: RealApiProduct, variant: RealApiVariant): ResolvedSeo {
  const productSeo = resolveProductSeo(product);
  const productTitle = cleanText(product.title) ?? "Product";
  const variantTitle = cleanText(variant.title) ?? "Variant";
  const title =
    cleanText(variantField(variant, "seo_title") as string | null | undefined) ??
    productSeo.title ??
    `${productTitle} - ${variantTitle}`;
  const description =
    cleanText(variantField(variant, "seo_description") as string | null | undefined) ??
    productSeo.description ??
    cleanText(product.short_description) ??
    cleanText(product.description) ??
    `Buy ${productTitle} (${variantTitle}) online at ${SITE_NAME}. Premium packaging with GST invoice and fast shipping across India.`;
  const image =
    cleanText(variantField(variant, "og_image") as string | null | undefined) ??
    cleanText(variant.image) ??
    productSeo.openGraphImage;
  const openGraphTitle =
    cleanText(variantField(variant, "og_title") as string | null | undefined) ?? title;
  const openGraphDescription =
    cleanText(variantField(variant, "og_description") as string | null | undefined) ??
    description;
  const twitterImage =
    cleanText(variantField(variant, "twitter_image") as string | null | undefined) ?? image;
  const twitterTitle =
    cleanText(variantField(variant, "twitter_title") as string | null | undefined) ??
    openGraphTitle;
  const twitterDescription =
    cleanText(variantField(variant, "twitter_description") as string | null | undefined) ??
    openGraphDescription;

  return {
    title,
    description,
    keywords:
      cleanText(variantField(variant, "seo_keywords") as string | null | undefined) ??
      productSeo.keywords,
    indexable: variant.is_indexable !== false && productSeo.indexable,
    openGraphTitle,
    openGraphDescription,
    openGraphImage: image,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard: resolveTwitterCard(
      variantField(variant, "twitter_card") as string | null | undefined,
      twitterImage,
    ),
    schemaMode:
      (variantField(variant, "schema_mode") as SchemaMode) ?? productSeo.schemaMode,
    schemaJsonLd:
      cleanText(variantField(variant, "schema_json_ld") as string | null | undefined) ??
      productSeo.schemaJsonLd ??
      null,
  };
}

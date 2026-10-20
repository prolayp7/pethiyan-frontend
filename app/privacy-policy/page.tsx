import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import PageRenderer from "@/components/PageRenderer";
import { fetchPageBySlug } from "@/lib/pages";
import { brandTitle } from "@/lib/seo";

type PrivacyPolicyPageData = {
  title?: string;
  content?: string | null;
  content_blocks?: unknown;
  meta_title?: string | null;
  meta_description?: string | null;
};

async function getPrivacyPolicyPage(): Promise<PrivacyPolicyPageData | null> {
  return await fetchPageBySlug("privacy-policy") as PrivacyPolicyPageData | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPrivacyPolicyPage();

  return {
    title: brandTitle(page?.meta_title ?? page?.title ?? "Privacy Policy"),
    description: page?.meta_description ?? "Pethiyan's Privacy Policy — how we collect, use, and protect your personal data.",
    alternates: { canonical: "/privacy-policy" },
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicyPage();

  if (!page) notFound();

  return (
    <div className="bg-background">
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]">
                <ShieldCheck className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl font-extrabold text-(--color-secondary) sm:text-3xl">{page.title ?? "Privacy Policy"}</h1>
                <p className="mt-0.5 text-sm text-gray-500">How we collect, use, and protect your personal data.</p>
              </div>
            </div>
            <nav className="hidden shrink-0 items-center gap-1.5 text-sm text-gray-500 sm:flex" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 transition-colors hover:text-(--color-primary)">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="font-medium text-(--color-secondary)">{page.title ?? "Privacy Policy"}</span>
            </nav>
          </div>
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-8 rounded-2xl border border-gray-100 bg-white p-8 text-sm leading-relaxed text-gray-600 shadow-sm lg:p-10">
            {page.content?.trim() ? (
              <div
                className="[&_a]:text-(--color-primary) [&_a]:underline [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-(--color-secondary) [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-(--color-secondary) [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-(--color-secondary) [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : page.content_blocks ? (
              <PageRenderer doc={page.content_blocks} />
            ) : (
              <p>Privacy policy content is not currently available.</p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

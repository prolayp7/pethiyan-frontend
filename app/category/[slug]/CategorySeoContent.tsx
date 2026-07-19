"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";

interface CategorySeoContentProps {
  html?: string;
}

const COLLAPSED_MAX_HEIGHT = 180;

export default function CategorySeoContent({ html }: CategorySeoContentProps) {
  const [expanded, setExpanded] = useState(false);
  const resolvedHtml = html?.trim() ?? "";

  if (!resolvedHtml) return null;

  return (
    <section className="bg-white pt-4 pb-0 sm:pt-5">
      <Container>
        <div className="rounded-[30px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:px-6">
          <div className="relative overflow-hidden">
            <div
              id="category-seo-content-body"
              className="footer-seo-prose"
              style={{
                maxHeight: expanded ? "none" : `${COLLAPSED_MAX_HEIGHT}px`,
              }}
              dangerouslySetInnerHTML={{ __html: resolvedHtml }}
            />
            {!expanded && (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent"
                aria-hidden="true"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls="category-seo-content-body"
            className="mt-2 text-sm font-semibold text-(--color-primary) hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useState } from "react";

const COLLAPSED_MAX_HEIGHT = 44;

export default function CategoryHeaderContent({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-0.5">
      <div className="relative overflow-hidden">
        <div
          id="category-header-content-body"
          className="text-gray-500 text-sm"
          style={{ maxHeight: expanded ? "none" : `${COLLAPSED_MAX_HEIGHT}px` }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent"
            aria-hidden="true"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="category-header-content-body"
        className="mt-1 text-sm font-semibold text-(--color-primary) hover:underline"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

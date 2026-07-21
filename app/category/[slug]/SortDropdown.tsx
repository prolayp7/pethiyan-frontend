"use client";

import { ChevronDown } from "lucide-react";
import { type CatalogSortValue } from "@/lib/catalog-preferences";
import { useSort } from "./SortContext";

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured"   },
  { label: "Price: Low to High", value: "price-asc"  },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function SortDropdown() {
  const { sort, setSort } = useSort();

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
      <div className="relative">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as CatalogSortValue)}
          className="appearance-none rounded-xl border border-(--color-border) bg-white py-2 pl-4 pr-9 text-sm transition focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30"
          aria-label="Sort category products"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
      </div>
    </div>
  );
}

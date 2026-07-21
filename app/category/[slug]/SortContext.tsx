"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { readCatalogSortPreference, writeCatalogSortPreference, type CatalogSortValue } from "@/lib/catalog-preferences";

interface SortContextValue {
  sort: CatalogSortValue;
  setSort: (value: CatalogSortValue) => void;
}

const SortContext = createContext<SortContextValue | null>(null);

export function SortProvider({ children }: { children: ReactNode }) {
  const [sort, setSort] = useState<CatalogSortValue>(() => readCatalogSortPreference());

  useEffect(() => {
    writeCatalogSortPreference(sort);
  }, [sort]);

  return <SortContext.Provider value={{ sort, setSort }}>{children}</SortContext.Provider>;
}

export function useSort() {
  const ctx = useContext(SortContext);
  if (!ctx) throw new Error("useSort must be used within a SortProvider");
  return ctx;
}

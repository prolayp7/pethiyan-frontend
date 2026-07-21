"use client";

import { type RealApiProduct } from "@/lib/api";
import { useSort } from "./SortContext";
import CategoryProducts from "./CategoryProducts";

interface Props {
  initialProducts: RealApiProduct[];
}

export default function CategoryClientLayout({ initialProducts }: Props) {
  const { sort } = useSort();

  return <CategoryProducts initialProducts={initialProducts} sort={sort} />;
}

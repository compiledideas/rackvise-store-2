"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  useStorefrontCategories,
  useStorefrontCategoryProducts,
} from "@rackvise/storefront-sdk";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/storefront/ProductGrid";
import { EmptyState } from "@/components/storefront/EmptyState";
import { ErrorState } from "@/components/storefront/QueryState";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = use(params);
  const id = Number(idParam);
  // Guard against non-numeric ids so we never request
  // /api/public/categories/NaN/products.
  const validId = Number.isFinite(id) && id > 0;

  const categories = useStorefrontCategories();
  const current =
    (categories.data ?? []).find((c) => c.id === id)?.name ?? "Category";

  const products = useStorefrontCategoryProducts(
    id,
    { limit: 24 },
    { enabled: validId },
  );

  if (!validId) {
    return (
      <div className="page-wrap py-16">
        <ErrorState message="This category could not be found." />
      </div>
    );
  }

  return (
    <div className="page-wrap py-12">
      <nav
        className="mb-8 flex items-center gap-1 text-xs text-ink-soft"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition-colors hover:text-accent-deep">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/shop" className="transition-colors hover:text-accent-deep">
          Shop
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-ink">{current}</span>
      </nav>

      <header className="mb-10 border-b border-line pb-8">
        <p className="eyebrow">Category</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="display-title text-[clamp(2.2rem,6vw,3.8rem)] leading-[0.9] text-ink">
            {current}
          </h1>
          <p className="pb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            {products.data?.pagination?.total ?? 0}{" "}
            {(products.data?.pagination?.total ?? 0) === 1 ? "item" : "items"}
          </p>
        </div>
      </header>

      {products.isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : products.isError ? (
        <ErrorState onRetry={() => products.refetch()} />
      ) : (products.data?.data ?? []).length === 0 ? (
        <EmptyState
          title="No products in this category yet"
          description="Check back soon or explore other categories."
        />
      ) : (
        <ProductGrid products={products.data?.data} priorityCount={4} editorial />
      )}
    </div>
  );
}

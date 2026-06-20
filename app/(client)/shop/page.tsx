"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStorefrontProducts } from "@rackvise/storefront-sdk";
import { SlidersHorizontal } from "lucide-react";
import { Filters, type ShopFilters } from "@/components/storefront/Filters";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/storefront/ProductGrid";
import { EmptyState } from "@/components/storefront/EmptyState";
import { ErrorState } from "@/components/storefront/QueryState";
import { Button } from "@/components/ui/button";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? undefined;

  const [filters, setFilters] = useState<ShopFilters>({
    search: initialSearch,
    sort: "createdAt-desc",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // keep filters in sync if the user searches again from the header
  useEffect(() => {
    const q = searchParams.get("search") ?? undefined;
    setFilters((prev) => ({ ...prev, search: q }));
  }, [searchParams]);

  const { data, isLoading, isError, refetch } = useStorefrontProducts({
    categoryId: filters.categoryId,
    search: filters.search,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort,
    limit: 24,
  });

  const products = data?.data ?? [];
  const total = data?.pagination?.total;

  const filterPanel = (
    <Filters value={filters} onChange={setFilters} className="space-y-6" />
  );

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Shop all products
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {typeof total === "number"
            ? `${total} ${total === 1 ? "product" : "products"} available`
            : "Browse the full catalog"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            {filterPanel}
          </div>
        </aside>

        <div>
          {/* Mobile filter toggle */}
          <div className="mb-4 lg:hidden">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => setMobileFiltersOpen((v) => !v)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {mobileFiltersOpen ? "Hide filters" : "Show filters"}
            </Button>
            {mobileFiltersOpen ? (
              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                {filterPanel}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={SlidersHorizontal}
              title="No products match your filters"
              description="Try adjusting your search, price range, or category."
              action={
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({ sort: "createdAt-desc" })
                  }
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ProductGrid products={products} priorityCount={4} />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStorefrontCategories, useStorefrontProducts } from "@rackvise/storefront-sdk";
import { SlidersHorizontal } from "lucide-react";
import { Filters, type ShopFilters } from "@/components/storefront/Filters";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/storefront/ProductGrid";
import { EmptyState } from "@/components/storefront/EmptyState";
import { ErrorState } from "@/components/storefront/QueryState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? undefined;

  const [filters, setFilters] = useState<ShopFilters>({
    search: initialSearch,
    sort: "createdAt-desc",
  });
  const [refineOpen, setRefineOpen] = useState(false);

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

  const categories = useStorefrontCategories();
  const products = data?.data ?? [];
  const total = data?.pagination?.total;
  const activeCategory = (categories.data ?? []).find(
    (c) => c.id === filters.categoryId,
  );
  const hasRefinements =
    !!filters.search ||
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number" ||
    filters.sort !== "createdAt-desc" ||
    typeof filters.categoryId === "number";

  return (
    <div className="page-wrap py-10">
      {/* Editorial masthead */}
      <header className="border-b border-line pb-8">
        <p className="eyebrow">The catalogue</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="display-title text-[clamp(2.6rem,7vw,4.5rem)] leading-[0.9] text-ink">
            {activeCategory ? activeCategory.name : "Shop all"}
          </h1>
          <p className="pb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            {typeof total === "number"
              ? `${total} ${total === 1 ? "item" : "items"}`
              : "Browse everything"}
          </p>
        </div>
      </header>

      {/* Toolbar: category chips + refine toggle */}
      <div className="sticky top-16 z-30 -mx-1 border-b border-line bg-paper/95 px-1 py-3 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-hide">
            <CategoryChip
              active={!filters.categoryId}
              onClick={() => setFilters((f) => ({ ...f, categoryId: undefined }))}
            >
              All
            </CategoryChip>
            {categories.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-sm" />
                ))
              : (categories.data ?? []).map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    active={filters.categoryId === cat.id}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        categoryId: f.categoryId === cat.id ? undefined : cat.id,
                      }))
                    }
                  >
                    {cat.name}
                  </CategoryChip>
                ))}
          </div>
          <Button
            variant={refineOpen || hasRefinements ? "default" : "outline"}
            size="sm"
            className="shrink-0"
            onClick={() => setRefineOpen((v) => !v)}
            aria-expanded={refineOpen}
          >
            <SlidersHorizontal className="size-3.5" />
            Refine
          </Button>
        </div>
      </div>

      {/* Refine panel */}
      {refineOpen ? (
        <div className="fade-in">
          <Filters value={filters} onChange={setFilters} />
        </div>
      ) : null}

      {/* Grid */}
      <div className="pt-10">
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
                onClick={() => setFilters({ sort: "createdAt-desc" })}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <ProductGrid products={products} priorityCount={4} editorial />
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300",
        active
          ? "bg-accent text-white dark:text-[#131009]"
          : "border border-line text-ink-soft hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

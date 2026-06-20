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

  const categories = useStorefrontCategories();
  const current =
    (categories.data ?? []).find((c) => c.id === id)?.name ?? "Category";

  const products = useStorefrontCategoryProducts(id, { limit: 24 });

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-1 text-xs text-gray-400">
        <Link href="/" className="hover:text-shop_dark_green hoverEffect">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-shop_dark_green hoverEffect">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-600">{current}</span>
      </nav>

      <h1 className="mb-1 text-3xl font-bold tracking-tight text-gray-900">
        {current}
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        {products.data?.pagination?.total ?? 0} products
      </p>

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
        <ProductGrid products={products.data?.data} priorityCount={4} />
      )}
    </div>
  );
}

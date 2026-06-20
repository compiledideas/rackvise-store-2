import type { Product } from "@rackvise/storefront-sdk";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products?: Product[];
  priorityCount?: number;
  className?: string;
}

export function ProductGrid({
  products,
  priorityCount = 0,
  className,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {products?.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
        >
          <div className="aspect-square w-full animate-pulse bg-gray-100" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

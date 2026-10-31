import type { Product } from "@rackvise/storefront-sdk";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products?: Product[];
  priorityCount?: number;
  /** Editorial mosaic: the first tile spans 2×2 on desktop. */
  editorial?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  priorityCount = 0,
  editorial = false,
  className,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4",
        editorial &&
          "auto-rows-fr lg:auto-rows-auto lg:[&>*:first-child]:col-span-2 lg:[&>*:first-child]:row-span-2",
        className,
      )}
    >
      {products?.map((product, index) => (
        <div
          key={product.id}
          className="rise-in h-full"
          style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}
        >
          <ProductCard
            product={product}
            // In editorial mode the first tile is the oversized hero — no index number on it.
            index={editorial && index === 0 ? undefined : index}
            priority={index < priorityCount}
            fillImage={editorial && index === 0}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] w-full animate-pulse bg-paper-deep" />
          <div className="mt-3 space-y-2">
            <div className="h-2.5 w-1/3 animate-pulse rounded-sm bg-paper-deep" />
            <div className="h-3.5 w-full animate-pulse rounded-sm bg-paper-deep" />
            <div className="h-4 w-1/2 animate-pulse rounded-sm bg-paper-deep" />
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useStorefrontCategories } from "@rackvise/storefront-sdk";
import type { GetProductsParams } from "@rackvise/storefront-sdk";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ShopFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: GetProductsParams["sort"];
}

interface FiltersProps {
  value: ShopFilters;
  onChange: (next: ShopFilters) => void;
  className?: string;
}

const sortOptions: { label: string; value: NonNullable<ShopFilters["sort"]> }[] =
  [
    { label: "Newest", value: "createdAt-desc" },
    { label: "Name: A–Z", value: "name-asc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
  ];

export function Filters({ value, onChange, className }: FiltersProps) {
  const { data: categories, isLoading } = useStorefrontCategories();

  const set = (patch: Partial<ShopFilters>) => onChange({ ...value, ...patch });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="filter-search" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Search
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="filter-search"
            value={value.search ?? ""}
            onChange={(e) => set({ search: e.target.value || undefined })}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Category
        </Label>
        <div className="flex flex-wrap gap-1.5">
          <CategoryChip
            active={!value.categoryId}
            onClick={() => set({ categoryId: undefined })}
          >
            All
          </CategoryChip>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-16 rounded-full" />
              ))
            : (categories ?? []).map((cat) => (
                <CategoryChip
                  key={cat.id}
                  active={value.categoryId === cat.id}
                  onClick={() => set({ categoryId: cat.id })}
                >
                  {cat.name}
                </CategoryChip>
              ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Price range
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={value.minPrice ?? ""}
            onChange={(e) =>
              set({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <span className="text-gray-400">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={value.maxPrice ?? ""}
            onChange={(e) =>
              set({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Sort by
        </Label>
        <div className="flex flex-col gap-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set({ sort: opt.value })}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hoverEffect",
                value.sort === opt.value
                  ? "bg-shop_dark_green text-white"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      <button
        type="button"
        onClick={() => onChange({})}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-shop_dark_green hover:text-shop_light_green hoverEffect"
      >
        <X className="h-4 w-4" /> Clear filters
      </button>
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
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-semibold hoverEffect",
        active
          ? "bg-shop_dark_green text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
      )}
    >
      {children}
    </button>
  );
}

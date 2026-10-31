"use client";

import { Search, X } from "lucide-react";
import type { GetProductsParams } from "@rackvise/storefront-sdk";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    { label: "Name A–Z", value: "name-asc" },
    { label: "Price ↑", value: "price-asc" },
    { label: "Price ↓", value: "price-desc" },
  ];

/**
 * Horizontal refine panel — search, price range and sort laid out as
 * editorial columns (categories live in the shop toolbar).
 */
export function Filters({ value, onChange, className }: FiltersProps) {
  const set = (patch: Partial<ShopFilters>) => onChange({ ...value, ...patch });

  return (
    <div
      className={cn(
        "grid gap-8 border-b border-line px-1 py-6 sm:grid-cols-3",
        className,
      )}
    >
      {/* Search */}
      <div className="space-y-2.5">
        <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
          Search
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={value.search ?? ""}
            onChange={(e) => set({ search: e.target.value || undefined })}
            placeholder="Keyword…"
            className="ps-9"
          />
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2.5">
        <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
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
          <span className="text-ink-soft">–</span>
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
      <div className="space-y-2.5">
        <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
          Sort by
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set({ sort: opt.value })}
              aria-pressed={value.sort === opt.value}
              className={cn(
                "px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300",
                value.sort === opt.value
                  ? "bg-ink text-paper"
                  : "border border-line text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange({})}
        className="inline-flex items-center gap-1.5 self-end text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep"
      >
        <X className="size-3.5" /> Clear all
      </button>
    </div>
  );
}

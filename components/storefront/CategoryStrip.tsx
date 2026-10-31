"use client";

import Link from "next/link";
import { useStorefrontCategories } from "@rackvise/storefront-sdk";
import type { Category } from "@rackvise/storefront-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "./SectionHeading";
import { ProductImage } from "./ProductImage";

export function CategoryStrip() {
  const { data, isLoading } = useStorefrontCategories();

  const categories = (data ?? []).slice(0, 8);

  return (
    <section className="page-wrap mt-16">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by category"
        description="Find exactly what you need, faster."
        viewAllHref="/shop"
        viewAllLabel="All products"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-sm" />
          ))}
        </div>
      ) : categories.length === 0 ? null : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryTile
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CategoryTile({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  const count = category._count?.products;

  return (
    <div
      className="rise-in"
      style={{ animationDelay: `${Math.min(index, 7) * 60}ms` }}
    >
      <Link href={`/category/${category.id}`} className="group flex items-center gap-4">
        <ProductImage
          src={category.imageUrl}
          alt={category.name}
          className="size-16 shrink-0"
          sizes="64px"
        />
        <div className="min-w-0 border-b border-line pb-3">
          <p className="truncate text-[13px] font-bold uppercase tracking-[0.1em] text-ink decoration-accent decoration-2 underline-offset-4 transition-colors duration-300 group-hover:text-accent group-hover:underline">
            {category.name}
          </p>
          {typeof count === "number" ? (
            <p className="mt-0.5 text-xs text-ink-soft tabular-nums">
              {count} {count === 1 ? "product" : "products"}
            </p>
          ) : null}
        </div>
      </Link>
    </div>
  );
}

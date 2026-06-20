"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useStorefrontCategories } from "@rackvise/storefront-sdk";
import type { Category } from "@rackvise/storefront-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "./ProductImage";

export function CategoryStrip() {
  const { data, isLoading } = useStorefrontCategories();

  const categories = (data ?? []).slice(0, 8);

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-12">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shop_light_green">
          Browse
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          Shop by category
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat, index) => (
            <CategoryTile key={cat.id} category={cat} index={index} />
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link
        href={`/category/${category.id}`}
        className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm hover:shadow-md hoverEffect"
      >
        <ProductImage
          src={category.imageUrl}
          alt={category.name}
          className="h-16 w-16 rounded-full"
          sizes="64px"
        />
        <span className="line-clamp-1 text-sm font-semibold text-gray-800 group-hover:text-shop_dark_green hoverEffect">
          {category.name}
        </span>
      </Link>
    </motion.div>
  );
}

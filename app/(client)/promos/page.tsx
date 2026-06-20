"use client";

import Link from "next/link";
import { useStorefrontPromos } from "@rackvise/storefront-sdk";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Tag } from "lucide-react";
import { ErrorState } from "@/components/storefront/QueryState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromosPage() {
  const { data, isLoading, isError, refetch } = useStorefrontPromos();

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10">
      <header className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shop_light_green">
          Limited time
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Active promotions
        </h1>
        <p className="max-w-xl text-sm text-gray-500">
          Check out our current offers and save on curated essentials while
          stocks last.
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-shop_light_pink text-shop_dark_green">
            <Tag className="h-7 w-7" />
          </span>
          <h3 className="text-lg font-semibold text-gray-900">
            No active promotions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Check back soon for new deals and discounts.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/shop">Browse all products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link
                href="#"
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-shop_dark_green to-shop_btn_dark_green p-6 text-white shadow-sm transition-shadow hover:shadow-md md:p-8"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-shop_orange/15 blur-2xl" />
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                  <Sparkles className="h-3 w-3" />
                  {promo.products.length}{" "}
                  {promo.products.length === 1 ? "product" : "products"}
                </span>
                <h3 className="mt-3 text-xl font-bold md:text-2xl">
                  {promo.title}
                </h3>
                {promo.subTitle ? (
                  <p className="mt-1 text-sm text-white/75">{promo.subTitle}</p>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-white/80 group-hover:text-white hoverEffect">
                  Shop now <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

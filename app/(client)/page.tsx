"use client";

import Link from "next/link";
import {
  useStorefrontProducts,
  useStorefrontPromos,
  useStorefrontTopSellingProducts,
} from "@rackvise/storefront-sdk";
import { Sparkles } from "lucide-react";
import { Hero } from "@/components/storefront/Hero";
import { CategoryStrip } from "@/components/storefront/CategoryStrip";
import { StatStrip } from "@/components/storefront/StatStrip";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/storefront/ProductGrid";
import { ErrorState } from "@/components/storefront/QueryState";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const featured = useStorefrontProducts({ limit: 10, sort: "createdAt-desc" });
  const topSelling = useStorefrontTopSellingProducts();
  const promos = useStorefrontPromos();

  return (
    <>
      <Hero />
      <StatStrip />
      <CategoryStrip />

      {/* Featured products */}
      <section className="mx-auto max-w-screen-xl px-4 py-12">
        <SectionHeading
          eyebrow="Fresh arrivals"
          title="Featured products"
          description="Hand-picked items from across the catalog."
          viewAllHref="/shop"
        />
        {featured.isLoading ? (
          <ProductGridSkeleton />
        ) : featured.isError ? (
          <ErrorState onRetry={() => featured.refetch()} />
        ) : (
          <ProductGrid
            products={featured.data?.data}
            priorityCount={4}
          />
        )}
      </section>

      {/* Top selling */}
      {topSelling.data && topSelling.data.length > 0 ? (
        <section className="bg-shop_light_bg py-12">
          <div className="mx-auto max-w-screen-xl px-4">
            <SectionHeading
              eyebrow="Customer favourites"
              title="Top selling"
              viewAllHref="/shop"
            />
            <ProductGrid products={topSelling.data as never} />
          </div>
        </section>
      ) : null}

      {/* Promos */}
      {promos.data && promos.data.length > 0 ? (
        <section className="mx-auto max-w-screen-xl px-4 py-12">
          <SectionHeading
            eyebrow="Limited time"
            title="Active promotions"
            viewAllHref="/promos"
          />
          <div className="space-y-6">
            {promos.data.slice(0, 1).map((promo) => (
              <div
                key={promo.id}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-shop_dark_green to-shop_btn_dark_green p-8 text-white md:p-12"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-shop_orange/20 blur-2xl" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" /> {promo.products.length}{" "}
                  products on sale
                </span>
                <h3 className="mt-4 max-w-lg text-2xl font-bold md:text-3xl">
                  {promo.title}
                </h3>
                {promo.subTitle ? (
                  <p className="mt-2 max-w-md text-sm text-white/80">
                    {promo.subTitle}
                  </p>
                ) : null}
                <Button
                  asChild
                  className="mt-6 rounded-full bg-white text-shop_dark_green hover:bg-white/90"
                >
                  <Link href="/promos">Shop the promo</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

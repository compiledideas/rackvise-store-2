"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  useStorefrontProducts,
  useStorefrontPromos,
  useStorefrontTopSellingProducts,
} from "@rackvise/storefront-sdk";
import { Hero } from "@/components/storefront/Hero";
import { ValueMarquee } from "@/components/storefront/ValueMarquee";
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
  const featured = useStorefrontProducts({ limit: 8, sort: "createdAt-desc" });
  const topSelling = useStorefrontTopSellingProducts();
  const promos = useStorefrontPromos();

  const topPromo = promos.data?.[0];

  return (
    <>
      <Hero />
      <ValueMarquee />
      <CategoryStrip />

      {/* Featured products */}
      <section className="page-wrap mt-20">
        <SectionHeading
          eyebrow="Fresh arrivals"
          title="Featured products"
          description="Hand-picked items from across the catalogue."
          viewAllHref="/shop"
        />
        {featured.isLoading ? (
          <ProductGridSkeleton />
        ) : featured.isError ? (
          <ErrorState onRetry={() => featured.refetch()} />
        ) : (
          <ProductGrid products={featured.data?.data} priorityCount={4} editorial />
        )}
      </section>

      {/* Promo feature band */}
      {topPromo ? (
        <section className="page-wrap mt-24">
          <div className="relative overflow-hidden bg-accent text-white dark:text-[#131009]">
            <div className="grid items-center gap-8 p-8 md:grid-cols-[1fr_200px] md:p-12">
              <div className="flex flex-col items-start gap-6">
                <span className="inline-flex items-center gap-1.5 border-2 border-current px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">
                  <Sparkles className="size-3.5" />
                  {topPromo.products.length}{" "}
                  {topPromo.products.length === 1 ? "product" : "products"} on
                  sale
                </span>
                <div>
                  <h2 className="display-title max-w-xl text-3xl md:text-4xl">
                    {topPromo.title}
                  </h2>
                  {topPromo.subTitle ? (
                    <p className="mt-3 max-w-md text-sm font-medium opacity-80">
                      {topPromo.subTitle}
                    </p>
                  ) : null}
                </div>
                <Button asChild size="lg" className="bg-ink text-paper">
                  <Link href="/promos">
                    Shop the promo <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              {topPromo.imageUrl ? (
                <div className="relative hidden aspect-[3/4] overflow-hidden md:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={topPromo.imageUrl}
                    alt={topPromo.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Top selling */}
      {topSelling.data && topSelling.data.length > 0 ? (
        <section className="mt-24 border-y border-line bg-paper-deep py-16">
          <div className="page-wrap">
            <SectionHeading
              eyebrow="Customer favourites"
              title="Top selling"
              description="What everyone is buying right now."
              viewAllHref="/shop"
            />
            <ProductGrid products={topSelling.data} />
          </div>
        </section>
      ) : null}

      {/* Stats */}
      <div className="mt-16">
        <StatStrip />
      </div>
    </>
  );
}

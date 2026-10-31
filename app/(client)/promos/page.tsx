"use client";

import Link from "next/link";
import { useStorefrontPromos } from "@rackvise/storefront-sdk";
import type { Promo, PromoProduct } from "@rackvise/storefront-sdk";
import { Sparkles, ArrowRight, Tag } from "lucide-react";
import { ErrorState } from "@/components/storefront/QueryState";
import { EmptyState } from "@/components/storefront/EmptyState";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/storefront/ProductGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromosPage() {
  const { data, isLoading, isError, refetch } = useStorefrontPromos();

  return (
    <div className="page-wrap py-12">
      <header className="mb-10 border-b border-line pb-8">
        <p className="eyebrow">Limited time</p>
        <h1 className="display-title mt-3 text-[clamp(2.2rem,6vw,3.8rem)] leading-[0.9] text-ink">
          Active promotions
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-soft">
          Current offers across the catalogue — promo prices applied
          automatically in your cart.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-10">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="h-40 rounded-3xl" />
              <ProductGridSkeleton count={4} />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No active promotions"
          description="Check back soon for new deals and discounts."
          action={
            <Button asChild className="rounded-sm">
              <Link href="/shop">Browse all products</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-16">
          {data.map((promo) => (
            <PromoSection key={promo.id} promo={promo} />
          ))}
        </div>
      )}
    </div>
  );
}

function PromoSection({ promo }: { promo: Promo }) {
  const products: PromoProduct[] = promo.products ?? [];

  return (
    <section className="rise-in space-y-7">
      {/* Promo banner */}
      <div className="relative overflow-hidden bg-accent text-white dark:text-[#131009]">
        <div className="grid items-center gap-8 p-8 md:grid-cols-[1fr_180px] md:p-10">
          <div className="flex flex-col items-start gap-5">
            <span className="inline-flex items-center gap-1.5 border-2 border-current px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">
              <Sparkles className="size-3.5" />
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              on sale
            </span>
            <div>
              <h2 className="display-title text-2xl md:text-3xl">{promo.title}</h2>
              {promo.subTitle ? (
                <p className="mt-2 max-w-lg text-sm font-medium opacity-80">
                  {promo.subTitle}
                </p>
              ) : null}
            </div>
          </div>
          {promo.imageUrl ? (
            <div className="relative hidden aspect-[3/4] overflow-hidden md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Promo-priced products — promoPrice becomes the current price,
          the regular price is struck through. */}
      {products.length > 0 ? (
        <ProductGrid
          products={products.map((p) => ({
            ...p,
            price: p.promoPrice,
            oldPrice: p.price,
          }))}
        />
      ) : (
        <EmptyState
          title="No products in this promo yet"
          description="Check back soon — offers are updated regularly."
          action={
            <Button asChild variant="outline" className="rounded-sm">
              <Link href="/shop">
                Browse all products <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
      )}
    </section>
  );
}

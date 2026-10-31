"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Banknote, Truck, UserRound } from "lucide-react";
import {
  useStorefrontConfig,
  useStorefrontHero,
  useStorefrontProducts,
} from "@rackvise/storefront-sdk";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useCurrencySymbol } from "@/hooks/useCurrencySymbol";

export function Hero() {
  // A 404 here just means the merchant hasn't configured a landing page —
  // fall back to defaults instead of retrying.
  const { data: hero, isLoading } = useStorefrontHero({ retry: false });
  const { data: config } = useStorefrontConfig({ staleTime: 5 * 60_000 });
  const symbol = useCurrencySymbol();

  const title = isLoading
    ? "Welcome to the store"
    : (hero?.title ?? "Quality finds for every day");
  const subtitle =
    hero?.subtitle ??
    "Browse the full catalogue, fill your cart, and check out in seconds — no account needed.";
  const threshold = config?.freeShippingThreshold ?? 0;

  // No configured hero image? Show a staggered collage of the newest products.
  const heroImage = hero?.imageUrl ?? null;
  const { data: featured } = useStorefrontProducts(
    { limit: 4, sort: "createdAt-desc" },
    { enabled: !heroImage },
  );
  const collage =
    !heroImage && (featured?.data ?? []).some((p) => p.images?.[0]?.url);

  return (
    <section className="relative border-b border-line">
      <div className="page-wrap grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div className="rise-in flex flex-col items-start gap-7">
          {hero?.heroBadge ? (
            <span className="border border-line bg-surface px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
              <span className="me-2 inline-block size-1.5 bg-accent align-middle" />
              {hero.heroBadge}
            </span>
          ) : null}
          <h1 className="display-title max-w-2xl text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.95] text-ink">
            {title}
          </h1>
          <p className="max-w-md border-s-2 border-accent ps-4 text-[15px] leading-relaxed text-ink-soft">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop now <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/promos">View promos</Link>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-7 gap-y-2 pt-1 text-[13px] text-ink-soft">
            {threshold > 0 ? (
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-accent" />
                Free shipping over {formatPrice(threshold, symbol)}
              </li>
            ) : null}
            <li className="flex items-center gap-2">
              <Banknote className="size-4 text-accent" /> Cash on delivery
            </li>
            <li className="flex items-center gap-2">
              <UserRound className="size-4 text-accent" /> No account needed
            </li>
          </ul>
        </div>

        <div className="fade-in relative">
          {heroImage ? (
            <div className="zoom-frame relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-paper-deep sm:aspect-square lg:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt={hero?.title || "Featured collection"}
                className="zoom-img h-full w-full object-cover"
              />
            </div>
          ) : collage ? (
            <HeroCollage products={featured?.data ?? []} />
          ) : (
            <HeroFallbackPanel />
          )}

          {threshold > 0 ? (
            <div className="absolute -bottom-5 start-5 z-10 flex items-center gap-3 rounded-sm border border-line bg-surface px-4 py-3 shadow-[8px_8px_0_0_rgba(24,19,16,0.08)]">
              <span className="flex size-10 items-center justify-center bg-accent text-white dark:text-[#131009]">
                <Truck className="size-5" />
              </span>
              <div className="text-start leading-tight">
                <p className="text-[13px] font-bold uppercase tracking-wide text-ink">
                  Free shipping
                </p>
                <p className="text-xs text-ink-soft">
                  on orders over {formatPrice(threshold, symbol)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Staggered 2×2 mosaic of the newest products — the hero visual when none is configured. */
function HeroCollage({
  products,
}: {
  products: { id: number; name: string; images?: { url: string }[] }[];
}) {
  const tiles = [0, 1, 2, 3].map((i) => products[i]?.images?.[0]?.url);
  return (
    <div className="grid aspect-[4/5] grid-cols-2 gap-3">
      {tiles.map((url, i) => (
        <div
          key={i}
          className={
            i % 2 === 1 ? "relative mt-8" : "relative" // stagger right column down
          }
        >
          {url ? (
            <div className="relative h-full overflow-hidden rounded-sm border border-line bg-paper-deep">
              <Image
                src={url}
                alt={products[i]?.name ?? "Featured product"}
                fill
                sizes="(max-width: 1024px) 45vw, 25vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ) : (
            <HeroFallbackTile />
          )}
        </div>
      ))}
    </div>
  );
}

function HeroFallbackTile() {
  return (
    <div className="flex h-full items-center justify-center rounded-sm border border-line bg-paper-deep">
      <RackGlyph className="size-12 text-ink/15" />
    </div>
  );
}

function HeroFallbackPanel() {
  return (
    <div className="flex aspect-[4/5] items-center justify-center rounded-sm border border-line bg-paper-deep">
      <RackGlyph className="size-40 text-ink/15" />
    </div>
  );
}

function RackGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="4" y="4.6" width="16" height="4.1" />
      <rect x="4" y="9.95" width="16" height="4.1" opacity="0.62" />
      <rect x="4" y="15.3" width="10.4" height="4.1" opacity="0.32" />
    </svg>
  );
}

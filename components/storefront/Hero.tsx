"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useStorefrontHero } from "@rackvise/storefront-sdk";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { data: hero, isLoading } = useStorefrontHero();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-shop_dark_green via-shop_btn_dark_green to-shop_dark_green text-white">
      {/* decorative glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-shop_light_green/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-shop_orange/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-screen-xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-5"
        >
          {hero?.heroBadge ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-shop_light_green" />
              {hero.heroBadge}
            </span>
          ) : null}
          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {isLoading
              ? "Welcome to the store"
              : hero?.title || "Quality finds for every day"}
          </h1>
          <p className="max-w-md text-sm text-white/80 md:text-base">
            {hero?.subtitle ||
              "Browse the full catalog, fill your cart, and check out in seconds — no account needed."}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/shop">
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/promos">View promos</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative hidden md:block"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur">
            {hero?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.imageUrl}
                alt={hero.title || "Featured collection"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl">
                🛍️
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import {
  useStorefrontAboutContent,
  useStorefrontStats,
} from "@rackvise/storefront-sdk";
import { Info } from "lucide-react";
import { StatStrip } from "@/components/storefront/StatStrip";
import { ErrorState } from "@/components/storefront/QueryState";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutPage() {
  const { data: about, isLoading, isError, refetch } = useStorefrontAboutContent();
  const { data: stats } = useStorefrontStats();

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-shop_light_pink text-shop_dark_green">
          <Info className="h-6 w-6" />
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          About us
        </h1>
        <p className="text-base text-gray-500">
          Learn more about our store. Curated essentials, delivered with care.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-2xl">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : about?.contentEN ? (
          <article className="prose prose-stone max-w-none text-sm leading-relaxed text-gray-600">
            {about.contentEN.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </article>
        ) : (
          <p className="text-center text-sm text-gray-500">
            No about content available yet.
          </p>
        )}
      </div>

      {stats ? <StatStrip /> : null}
    </div>
  );
}

"use client";

import { useStorefrontAboutContent } from "@rackvise/storefront-sdk";
import { ErrorState } from "@/components/storefront/QueryState";
import { Skeleton } from "@/components/ui/skeleton";
import { StatStrip } from "@/components/storefront/StatStrip";

export default function AboutPage() {
  const { data: about, isLoading, isError, refetch } = useStorefrontAboutContent();

  return (
    <div className="page-wrap py-14">
      <header className="mb-12 border-b border-line pb-8 text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="display-title mt-3 text-[clamp(2.2rem,6vw,3.8rem)] leading-[0.9] text-ink">About us</h1>
        <p className="text-base text-muted-foreground">
          Learn more about our store. Curated essentials, delivered with care.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-2xl">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-5/6 rounded-sm" />
            <Skeleton className="h-4 w-4/6 rounded-sm" />
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-3/4 rounded-sm" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : about?.contentEN ? (
          <article className="prose prose-stone dark:prose-invert mx-auto max-w-none text-sm leading-relaxed text-ink-soft">
            {about.contentEN.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </article>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No about content available yet.
          </p>
        )}
      </div>

      <div className="mt-16">
        <StatStrip />
      </div>
    </div>
  );
}

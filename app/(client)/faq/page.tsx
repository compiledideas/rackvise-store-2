"use client";

import { useStorefrontFaqs } from "@rackvise/storefront-sdk";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ErrorState } from "@/components/storefront/QueryState";
import { EmptyState } from "@/components/storefront/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

export default function FaqPage() {
  const { data: faqs, isLoading, isError, refetch } = useStorefrontFaqs();

  const active = (faqs ?? []).filter((f) => f.isActive);

  return (
    <div className="page-wrap py-14">
      <header className="mb-12 border-b border-line pb-8 text-center">
        <p className="eyebrow">Help center</p>
        <h1 className="display-title mt-3 text-[clamp(2.2rem,6vw,3.8rem)] leading-[0.9] text-ink">Frequently asked questions</h1>
        <p className="text-base text-muted-foreground">
          Find answers to common questions about ordering, shipping, and more.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-2xl">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : active.length === 0 ? (
          <EmptyState
            title="No FAQs yet"
            description="Check back later for frequently asked questions."
          />
        ) : (
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-line bg-card px-5"
          >
            {active.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={String(faq.id)}
                className="border-line last:border-b-0"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-semibold text-ink">
                  {faq.questionEN}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {faq.answerEN}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

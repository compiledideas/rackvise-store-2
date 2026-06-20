"use client";

import { useStorefrontFaqs } from "@rackvise/storefront-sdk";
import { LifeBuoy } from "lucide-react";
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
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-shop_light_pink text-shop_dark_green">
          <LifeBuoy className="h-6 w-6" />
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="text-base text-gray-500">
          Find answers to common questions about ordering, shipping, and more.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-2xl">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
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
            className="rounded-2xl border border-gray-100 bg-white"
          >
            {active.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={String(faq.id)}
                className="px-5"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-gray-900"                >
                  {faq.questionEN}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed text-gray-600">
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

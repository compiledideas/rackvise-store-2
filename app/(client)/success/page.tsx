"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import { useStorefrontConfig } from "@rackvise/storefront-sdk";
import { formatPrice } from "@/lib/format";
import { useCurrencySymbol } from "@/hooks/useCurrencySymbol";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";
  const total = searchParams.get("total") ?? "";
  const [mounted, setMounted] = useState(false);
  const { data: config } = useStorefrontConfig({ staleTime: 5 * 60_000 });
  const symbol = useCurrencySymbol();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const storeName = config?.name ?? "the store";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-sm bg-success/10 text-success">
        <CheckCircle2 className="size-9" strokeWidth={1.75} />
      </span>

      <div className="space-y-2">
        <p className="eyebrow">Thank you</p>
        <h1 className="display-title text-3xl font-semibold text-ink">
          Order confirmed!
        </h1>
        <p className="text-sm text-muted-foreground">
          Thank you for your purchase from {storeName}. Your order has been
          placed successfully.
        </p>
      </div>

      <dl className="w-full space-y-2.5 rounded-2xl border border-line bg-card p-5 text-left">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-muted-foreground">Order number</dt>
          <dd className="text-sm font-semibold text-ink">
            {orderNumber || "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-muted-foreground">Total</dt>
          <dd className="text-sm font-semibold text-ink">
            {total ? formatPrice(Number(total), symbol) : "—"}
          </dd>
        </div>
      </dl>

      <Button asChild size="lg" className="w-full rounded-sm">
        <Link href="/shop">
          Continue shopping <ArrowRight className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="page-wrap">
      <Suspense
        fallback={
          <div className="py-20 text-center">
            <div className="mx-auto size-16 animate-pulse rounded-sm bg-paper-deep" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}

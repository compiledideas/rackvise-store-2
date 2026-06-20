"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";
  const total = searchParams.get("total") ?? "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="h-9 w-9" />
      </span>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Order confirmed!
        </h1>
        <p className="text-sm text-gray-500">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      <dl className="w-full space-y-2 rounded-2xl border border-gray-100 bg-white p-5 text-left">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Order number</dt>
          <dd className="text-sm font-semibold text-gray-900">
            {orderNumber || "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Total</dt>
          <dd className="text-sm font-semibold text-gray-900">
            {total ? `${Number(total).toFixed(2)} USD` : "—"}
          </dd>
        </div>
      </dl>

      <Button asChild size="lg" className="w-full rounded-full">
        <Link href="/shop">
          Continue shopping <ArrowRight className="h-4 w-4" />
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
    <div className="mx-auto max-w-screen-xl px-4">
      <Suspense
        fallback={
          <div className="py-20 text-center">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-gray-100" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}

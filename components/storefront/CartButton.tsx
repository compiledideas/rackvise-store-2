"use client";

import Link from "next/link";
import { useStorefrontCart } from "@rackvise/storefront-sdk";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const { totalItems } = useStorefrontCart();

  return (
    <Link
      href="/cart"
      aria-label={`View cart${totalItems > 0 ? ` (${totalItems} items)` : ""}`}
      className={cn(
        "relative inline-flex size-10 items-center justify-center text-ink transition-colors duration-300 hover:bg-paper-deep",
        className,
      )}
    >
      <ShoppingBag className="size-5" strokeWidth={1.75} />
      {totalItems > 0 ? (
        <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[10px] font-bold text-white dark:text-[#131009]">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useStorefrontCart } from "@rackvise/storefront-sdk";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const { totalItems } = useStorefrontCart();

  return (
    <Link
      href="/cart"
      aria-label="View cart"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-shop_dark_green hoverEffect",
        className,
      )}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-shop_orange px-1 text-[10px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </Link>
  );
}

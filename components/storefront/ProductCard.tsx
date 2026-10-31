"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Check, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@rackvise/storefront-sdk";
import { useStorefrontCart } from "@rackvise/storefront-sdk";
import { cn } from "@/lib/utils";
import { discountPercent } from "@/lib/format";
import { primaryProductImage } from "@/lib/product-image";
import { Badge } from "@/components/ui/badge";
import { Price } from "./Price";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
  /** Stretch the image to fill the card height (for mosaic hero tiles). */
  fillImage?: boolean;
  className?: string;
}

/**
 * Borderless catalogue card — image on the paper background, meta row below.
 * No card chrome; the grid's whitespace does the separating.
 */
export function ProductCard({
  product,
  priority,
  index,
  fillImage = false,
  className,
}: ProductCardProps) {
  const { addToCart } = useStorefrontCart();
  const [added, setAdded] = useState(false);

  const image = primaryProductImage(product);
  const off = discountPercent(product.price, product.oldPrice ?? undefined);
  const outOfStock = (product.stock ?? 0) <= 0;
  // Products with variants must be configured on the detail page — a blind
  // quick-add would put the base product in the cart at the wrong price.
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const category = product.categories?.[0]?.category?.name;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || hasVariants) return;
    addToCart(product);
    setAdded(true);
    toast.success(`${product.name} added to cart`);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "group flex h-full flex-col",
        className,
      )}
    >
      <div className={cn("zoom-frame relative", fillImage && "flex-1")}>
        <ProductImage
          src={image}
          alt={product.name}
          className={cn(
            "w-full",
            fillImage ? "h-full min-h-0" : "aspect-[3/4]",
          )}
          imageClassName={cn("zoom-img", outOfStock && "opacity-60 saturate-50")}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute start-3 top-3 flex flex-col gap-1.5">
          {off ? <Badge variant="sale">-{off}%</Badge> : null}
          {outOfStock ? <Badge>Sold out</Badge> : null}
        </div>
        {typeof index === "number" ? (
          <span className="absolute end-3 top-3 text-[11px] font-bold tracking-[0.12em] text-ink/50 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}

        {outOfStock ? null : hasVariants ? (
          <span className="absolute bottom-3 end-3 inline-flex translate-y-1 items-center gap-1.5 bg-ink px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-paper opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <SlidersHorizontal className="size-3.5" /> Options
          </span>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              "absolute bottom-3 end-3 flex size-10 translate-y-1 items-center justify-center text-white opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 dark:text-[#131009]",
              added ? "bg-success" : "bg-ink hover:bg-accent",
            )}
          >
            {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        {category ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            {category}
          </span>
        ) : null}
        <h3 className="line-clamp-1 text-[15px] font-semibold leading-snug text-ink decoration-accent decoration-2 underline-offset-4 transition-colors duration-300 group-hover:text-accent group-hover:underline">
          {product.name}
        </h3>
        <div className="mt-0.5">
          <Price
            amount={product.price}
            oldAmount={product.oldPrice ?? undefined}
          />
        </div>
      </div>
    </Link>
  );
}

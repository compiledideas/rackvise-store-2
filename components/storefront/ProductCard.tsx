"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@rackvise/storefront-sdk";
import { useStorefrontCart } from "@rackvise/storefront-sdk";
import { cn } from "@/lib/utils";
import { discountPercent } from "@/lib/format";
import toast from "react-hot-toast";
import { Price } from "./Price";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const { addToCart } = useStorefrontCart();
  const [added, setAdded] = useState(false);

  const image = product.images?.[0]?.url;
  const off = discountPercent(product.price, product.oldPrice ?? undefined);
  const outOfStock = (product.stock ?? 0) <= 0;
  const category = product.categories?.[0]?.category?.name;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) {
      toast.error("This product is out of stock");
      return;
    }
    addToCart(product);
    setAdded(true);
    toast.success(`${product.name} added to cart`);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      <Link
        href={`/product/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative">
          <ProductImage
            src={image}
            alt={product.name}
            className="aspect-square w-full"
            priority={priority}
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {off ? (
              <span className="rounded-full bg-shop_orange px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                -{off}%
              </span>
            ) : null}
            {outOfStock ? (
              <span className="rounded-full bg-gray-900/85 px-2.5 py-1 text-[11px] font-semibold text-white">
                Sold out
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {category ? (
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              {category}
            </span>
          ) : null}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-shop_dark_green hoverEffect">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <Price
              amount={product.price}
              oldAmount={product.oldPrice ?? undefined}
              className="text-base"
            />
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm hoverEffect",
                added
                  ? "bg-shop_light_green"
                  : "bg-shop_dark_green/90 hover:bg-shop_dark_green",
              )}
            >
              {added ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

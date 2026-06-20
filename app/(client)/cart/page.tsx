"use client";

import Link from "next/link";
import { useStorefrontCart } from "@rackvise/storefront-sdk";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Price } from "@/components/storefront/Price";
import { ProductImage } from "@/components/storefront/ProductImage";
import { QuantityStepper } from "@/components/storefront/QuantityStepper";
import { EmptyState } from "@/components/storefront/EmptyState";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function itemPrice(item: {
  product: { price: number };
  variant?: { price?: number | null } | null;
  subVariant?: { price?: number | null } | null;
}): number {
  if (item.subVariant?.price) return Number(item.subVariant.price);
  if (item.variant?.price) return Number(item.variant.price);
  return Number(item.product.price) || 0;
}

function itemStock(item: {
  product: { stock: number };
  variant?: { stock?: number | null } | null;
  subVariant?: { stock?: number | null } | null;
}): number {
  if (item.subVariant && typeof item.subVariant.stock === "number")
    return item.subVariant.stock;
  if (item.variant && typeof item.variant.stock === "number")
    return item.variant.stock;
  return item.product.stock ?? 0;
}

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useStorefrontCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that."
          action={
            <Button asChild className="rounded-full">
              <Link href="/shop">
                Start shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Your cart
        </h1>
        <button
          type="button"
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-600 hoverEffect"
        >
          <X className="h-4 w-4" /> Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const unit = itemPrice(item);
              const stock = itemStock(item);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-4 p-4"
                >
                  <Link
                    href={`/product/${item.product.id}`}
                    className="shrink-0"
                  >
                    <ProductImage
                      src={item.product.images?.[0]?.url}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-xl border border-gray-100"
                      sizes="96px"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.id}`}
                        className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-shop_dark_green hoverEffect"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success("Removed from cart");
                        }}
                        aria-label="Remove item"
                        className="text-gray-400 hover:text-red-600 hoverEffect"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      {item.variant ? (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5">
                          {item.variant.name}
                        </span>
                      ) : null}
                      {item.subVariant ? (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5">
                          {item.subVariant.size ?? "Standard"}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper
                        quantity={item.quantity}
                        max={stock}
                        onDecrease={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        onIncrease={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      />
                      <Price
                        amount={unit * item.quantity}
                        className="text-base"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-gray-900">
            Order summary
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Items ({totalItems})</span>
              <Price amount={subtotal} />
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600">Calculated at checkout</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-bold text-gray-900">
              <span>Subtotal</span>
              <Price amount={subtotal} className="text-base" />
            </div>
          </div>

          <Button asChild className="mt-6 w-full rounded-full" size="lg">
            <Link href="/checkout">
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm font-semibold text-shop_dark_green hover:text-shop_light_green hoverEffect"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useStorefrontCart } from "@rackvise/storefront-sdk";
import { ArrowRight, ShoppingBag, Trash2, X, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { primaryProductImage } from "@/lib/product-image";
import { Price } from "@/components/storefront/Price";
import { ProductImage } from "@/components/storefront/ProductImage";
import { QuantityStepper } from "@/components/storefront/QuantityStepper";
import { EmptyState } from "@/components/storefront/EmptyState";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useShippingQuote } from "@/hooks/useShippingQuote";
import { useCurrencySymbol } from "@/hooks/useCurrencySymbol";
import { formatPrice } from "@/lib/format";

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

  const shipping = useShippingQuote(subtotal);
  const symbol = useCurrencySymbol();

  if (items.length === 0) {
    return (
      <div className="page-wrap py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that."
          action={
            <Button asChild className="rounded-sm" size="lg">
              <Link href="/shop">
                Start shopping <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-wrap py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="eyebrow">Almost there</p>
          <h1 className="display-title mt-2 text-3xl font-semibold text-ink sm:text-4xl">
            Your cart
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors duration-300 hover:text-destructive"
        >
          <X className="size-4" /> Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <div className="space-y-4">
          {items.map((item) => {
            const unit = itemPrice(item);
            const stock = itemStock(item);
            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-line bg-card p-4"
              >
                <Link href={`/product/${item.product.id}`} className="shrink-0">
                  <ProductImage
                    src={primaryProductImage(item.product)}
                    alt={item.product.name}
                    className="size-24 rounded-xl border border-line"
                    sizes="96px"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="line-clamp-2 text-sm font-semibold text-ink transition-colors duration-300 hover:text-accent-deep"
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
                      className="shrink-0 text-ink-soft transition-colors duration-300 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {item.variant ? (
                      <span className="rounded-sm bg-paper-deep px-2 py-0.5 font-medium">
                        {item.variant.name}
                      </span>
                    ) : null}
                    {item.subVariant ? (
                      <span className="rounded-sm bg-paper-deep px-2 py-0.5 font-medium">
                        {item.subVariant.size ?? "Standard"}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantityStepper
                      quantity={item.quantity}
                      max={stock}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    />
                    <Price amount={unit * item.quantity} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-5 rounded-2xl border border-line bg-card p-6 lg:sticky lg:top-24">
          <h2 className="display-title text-lg font-semibold text-ink">
            Order summary
          </h2>

          {/* Free-shipping meter */}
          {shipping.threshold > 0 ? (
            <div className="rounded-xl bg-paper-deep p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-ink">
                <Truck className="size-4 text-accent-deep" />
                {shipping.freeShipping ? (
                  <span>You&apos;ve unlocked free shipping</span>
                ) : (
                  <span>
                    {formatPrice(shipping.remainingForFree, symbol)} away from
                    free shipping
                  </span>
                )}
              </p>
              <div
                className="mt-2.5 h-1.5 overflow-hidden bg-line"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={shipping.threshold}
                aria-valuenow={Math.min(subtotal, shipping.threshold)}
              >
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (subtotal / shipping.threshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-ink-soft">
              <span>Items ({totalItems})</span>
              <Price amount={subtotal} />
            </div>
            <div className="flex items-center justify-between text-ink-soft">
              <span>Shipping</span>
              {shipping.fee > 0 ? (
                <Price amount={shipping.fee} />
              ) : (
                <span className="font-semibold text-success">Free</span>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-bold text-ink">
              <span>Total</span>
              <Price amount={subtotal + shipping.fee} />
            </div>
          </div>

          <Button asChild className="w-full rounded-sm" size="lg">
            <Link href="/checkout">
              Proceed to checkout <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Link
            href="/shop"
            className="block text-center text-sm font-semibold text-accent-deep"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

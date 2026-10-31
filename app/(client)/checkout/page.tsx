"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useStorefrontCart,
  useStorefrontCheckout,
} from "@rackvise/storefront-sdk";
import type { OrderResponse } from "@rackvise/storefront-sdk";
import {
  ArrowRight,
  Lock,
  ShoppingBag,
  Tag,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/format";
import { Price } from "@/components/storefront/Price";
import { EmptyState } from "@/components/storefront/EmptyState";
import { ProductImage } from "@/components/storefront/ProductImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useShippingQuote } from "@/hooks/useShippingQuote";

interface FormState {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  shippingAddress: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, subtotal } = useStorefrontCart();
  const {
    activeCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
    total: couponTotal,
    submitCheckout,
    isSubmittingOrder,
  } = useStorefrontCheckout();

  const shipping = useShippingQuote(subtotal);

  const [form, setForm] = useState<FormState>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    shippingAddress: "",
  });
  const [couponInput, setCouponInput] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const discount = activeCoupon?.discountAmount ?? 0;
  // The SDK's checkout total covers items minus the coupon; shipping is
  // quoted from the store config and added on top.
  const grandTotal = couponTotal + shipping.fee;

  // Navigate to the success page as a side effect once the order is placed.
  // (Doing this directly during render is a React anti-pattern.)
  useEffect(() => {
    if (order) {
      router.push(
        `/success?order=${encodeURIComponent(order.orderNumber)}&total=${order.totalAmount}`,
      );
    }
  }, [order, router]);

  if (order) {
    return null;
  }

  if (items.length === 0 && !isSubmittingOrder) {
    return (
      <div className="page-wrap py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some items to your cart before checking out."
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

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.clientName.trim()) next.clientName = "Name is required";
    if (!form.clientPhone.trim()) next.clientPhone = "Phone is required";
    else if (!/^[+\d][\d\s-]{5,}$/.test(form.clientPhone.trim()))
      next.clientPhone = "Enter a valid phone number";
    if (!form.shippingAddress.trim())
      next.shippingAddress = "Address is required";
    if (form.clientEmail && !/^\S+@\S+\.\S+$/.test(form.clientEmail))
      next.clientEmail = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }
    try {
      const res = await submitCheckout({
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        clientEmail: form.clientEmail || undefined,
        shippingAddress: form.shippingAddress,
      });
      setOrder(res);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
  };

  return (
    <div className="page-wrap py-12">
      <header className="mb-10 max-w-xl">
        <p className="eyebrow">Checkout</p>
        <h1 className="display-title mt-2 text-3xl font-semibold text-ink sm:text-4xl">
          Complete your order
        </h1>
      </header>

      <form
        onSubmit={onSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-8">
          {/* 01 — Contact */}
          <section className="space-y-4">
            <StepTitle index={1} title="Contact details" />
            <div className="rounded-2xl border border-line bg-card p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="name"
                  label="Name"
                  required
                  error={errors.clientName}
                >
                  <Input
                    id="name"
                    value={form.clientName}
                    onChange={(e) => set("clientName", e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </Field>
                <Field
                  id="phone"
                  label="Phone"
                  required
                  error={errors.clientPhone}
                >
                  <Input
                    id="phone"
                    type="tel"
                    value={form.clientPhone}
                    onChange={(e) => set("clientPhone", e.target.value)}
                    placeholder="+1 234 567 890"
                    autoComplete="tel"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="email" label="Email (optional)" error={errors.clientEmail}>
                    <Input
                      id="email"
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) => set("clientEmail", e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </Field>
                </div>
              </div>
            </div>
          </section>

          {/* 02 — Shipping */}
          <section className="space-y-4">
            <StepTitle index={2} title="Shipping address" />
            <div className="rounded-2xl border border-line bg-card p-5">
              <Field
                id="address"
                label="Address"
                required
                error={errors.shippingAddress}
              >
                <Input
                  id="address"
                  value={form.shippingAddress}
                  onChange={(e) => set("shippingAddress", e.target.value)}
                  placeholder="Street, city, postal code"
                  autoComplete="street-address"
                />
              </Field>
            </div>
          </section>

          {/* 03 — Payment */}
          <section className="space-y-4">
            <StepTitle index={3} title="Payment" />
            <div className="rounded-2xl border border-line bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-accent-tint text-accent-deep">
                  <Wallet className="size-4" />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    Cash on delivery
                    <span className="rounded-sm bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase text-success">
                      Available
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Pay when you receive your order. No card needed.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-2xl border border-line bg-card p-6">
            <h2 className="display-title text-lg font-semibold text-ink">
              Order summary
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({totalItems})
              </span>
            </h2>

            {/* Items preview */}
            <ul className="max-h-44 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <ProductImage
                    src={item.product.images?.[0]?.url}
                    alt={item.product.name}
                    className="size-11 shrink-0 border border-line"
                    sizes="44px"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">
                    {item.product.name}
                    <span className="text-muted-foreground">
                      {" "}
                      × {item.quantity}
                    </span>
                  </span>
                  <Price
                    amount={
                      (item.subVariant?.price ?? item.variant?.price ?? item.product.price) *
                      item.quantity
                    }
                  />
                </li>
              ))}
            </ul>

            {/* Coupon */}
            {activeCoupon ? (
              <div className="flex items-center justify-between rounded-xl border border-success/25 bg-success/10 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 font-semibold text-success">
                  <Tag className="size-4" />
                  {activeCoupon.code}
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className="h-9 uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-sm"
                  disabled={isApplyingCoupon}
                  onClick={handleApplyCoupon}
                >
                  {isApplyingCoupon ? "…" : "Apply"}
                </Button>
              </div>
            )}
            {couponError ? (
              <p className="text-xs font-medium text-destructive" role="alert">
                {couponError}
              </p>
            ) : null}

            <Separator />

            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold text-ink">
                  <Price amount={subtotal} />
                </dd>
              </div>
              {discount > 0 ? (
                <div className="flex items-center justify-between">
                  <dt className="text-ink-soft">Discount</dt>
                  <dd className="font-semibold text-success">
                    −{formatPrice(discount)}
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="font-semibold text-ink">
                  {shipping.fee > 0 ? (
                    <Price amount={shipping.fee} />
                  ) : (
                    <span className="text-success">Free</span>
                  )}
                </dd>
              </div>
            </dl>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">Total</span>
              <Price amount={grandTotal} className="text-xl" />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-sm"
              disabled={isSubmittingOrder}
            >
              {isSubmittingOrder ? (
                "Placing order…"
              ) : (
                <>
                  <Lock className="size-4" /> Place order
                </>
              )}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <Lock className="size-3" />
              Your information is secure
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function StepTitle({ index, title }: { index: number; title: string }) {
  return (
    <h2 className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.14em] text-ink-soft">
      <span className="flex size-6 items-center justify-center rounded-sm bg-accent-tint text-xs font-bold text-accent-deep">
        {index}
      </span>
      {title}
    </h2>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : null}
    </div>
  );
}

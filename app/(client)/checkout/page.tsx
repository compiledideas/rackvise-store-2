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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
  const total = couponTotal;

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
      <div className="mx-auto max-w-screen-xl px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some items to your cart before checking out."
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
    <div className="mx-auto max-w-screen-xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
        Checkout
      </h1>

      <form
        onSubmit={onSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Contact details
            </h2>
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.clientName}
                    onChange={(e) => set("clientName", e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  {errors.clientName ? (
                    <p className="text-xs font-medium text-red-600">
                      {errors.clientName}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.clientPhone}
                    onChange={(e) => set("clientPhone", e.target.value)}
                    placeholder="+1 234 567 890"
                    autoComplete="tel"
                  />
                  {errors.clientPhone ? (
                    <p className="text-xs font-medium text-red-600">
                      {errors.clientPhone}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) => set("clientEmail", e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  {errors.clientEmail ? (
                    <p className="text-xs font-medium text-red-600">
                      {errors.clientEmail}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Shipping address
            </h2>
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="space-y-1.5">
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={form.shippingAddress}
                  onChange={(e) => set("shippingAddress", e.target.value)}
                  placeholder="Street, city, postal code"
                  autoComplete="street-address"
                />
                {errors.shippingAddress ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.shippingAddress}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Payment
            </h2>
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop_dark_green text-white">
                  <Wallet className="h-4 w-4" />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    Cash on delivery
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
                      Available
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Pay when you receive your order. No card needed.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Order summary
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalItems})
              </span>
            </h2>

            {activeCoupon ? (
              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 font-semibold text-green-700">
                  <Tag className="h-4 w-4" />
                  {activeCoupon.code}
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600"
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
                  disabled={isApplyingCoupon}
                  onClick={handleApplyCoupon}
                >
                  {isApplyingCoupon ? "..." : "Apply"}
                </Button>
              </div>
            )}
            {couponError ? (
              <p className="text-xs font-medium text-red-600" role="alert">
                Invalid coupon code
              </p>
            ) : null}

            <Separator />

            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-semibold text-gray-900">
                  <Price amount={subtotal} />
                </dd>
              </div>
              {discount > 0 ? (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Discount</dt>
                  <dd className="font-semibold text-green-600">
                    -{formatPrice(discount)}
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-semibold text-gray-900">
                  Calculated at delivery
                </dd>
              </div>
            </dl>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                <Price amount={total} />
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={isSubmittingOrder}
            >
              {isSubmittingOrder ? (
                "Placing order..."
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Place order
                </>
              )}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              Your information is secure
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

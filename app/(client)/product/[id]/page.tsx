"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useStorefrontProduct,
  useStorefrontProducts,
  useStorefrontCart,
} from "@rackvise/storefront-sdk";
import type {
  ProductVariant,
  ProductSubVariant,
} from "@rackvise/storefront-sdk";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { Price } from "@/components/storefront/Price";
import { ProductImage } from "@/components/storefront/ProductImage";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/storefront/ProductGrid";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import { ErrorState } from "@/components/storefront/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { discountPercent } from "@/lib/format";

function resolvePrice(
  base: number,
  variant?: ProductVariant,
  sub?: ProductSubVariant,
): number {
  if (sub?.price) return Number(sub.price);
  if (variant?.price) return Number(variant.price);
  return base;
}

function resolveStock(
  base: number,
  variant?: ProductVariant,
  sub?: ProductSubVariant,
): number {
  if (sub && typeof sub.stock === "number") return sub.stock;
  if (variant && typeof variant.stock === "number") return variant.stock;
  return base ?? 0;
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = use(params);
  const id = Number(idParam);

  if (!Number.isFinite(id) || id <= 0) {
    return (
      <div className="page-wrap py-16">
        <ErrorState message="This product could not be found." />
      </div>
    );
  }

  return <ProductView id={id} />;
}

function ProductView({ id }: { id: number }) {
  const router = useRouter();
  const { data: product, isLoading, isError, refetch } = useStorefrontProduct(
    id,
  );
  const { addToCart } = useStorefrontCart();

  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState<ProductVariant | undefined>();
  const [subVariant, setSubVariant] = useState<ProductSubVariant | undefined>();
  const [qty, setQty] = useState(1);

  const variants = product?.variants ?? [];
  // Variant-specific shots come first when a variant is selected, so the
  // gallery reflects the chosen colour.
  const images = [
    ...(variant?.images ?? []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: `${product?.name ?? ""} — ${variant?.name ?? ""}`,
    })),
    ...(product?.images ?? []),
  ];

  const price = product ? resolvePrice(product.price, variant, subVariant) : 0;
  const stock = product ? resolveStock(product.stock, variant, subVariant) : 0;
  const outOfStock = stock <= 0;
  const oldPrice =
    variant || subVariant ? undefined : (product?.oldPrice ?? undefined);
  const discount = discountPercent(price, oldPrice);

  // Related products by first category
  const relatedCategoryId = product?.categories?.[0]?.categoryId;
  const related = useStorefrontProducts(
    { categoryId: relatedCategoryId, limit: 5, sort: "createdAt-desc" },
    { enabled: !!relatedCategoryId },
  );
  const relatedProducts = (related.data?.data ?? []).filter((p) => p.id !== id);

  const handleAdd = (): boolean => {
    if (!product) return false;
    if (outOfStock) {
      toast.error("This product is out of stock");
      return false;
    }
    if (variants.length > 0 && !variant) {
      toast.error("Please select a variant first");
      return false;
    }
    if (variant?.subVariants && variant.subVariants.length > 0 && !subVariant) {
      toast.error("Please select a size first");
      return false;
    }
    addToCart(product, variant, subVariant, qty);
    toast.success(`${product.name} added to cart`);
    return true;
  };

  const handleBuyNow = () => {
    if (handleAdd()) {
      router.push("/cart");
    }
  };

  if (isLoading) return <ProductSkeleton />;
  if (isError)
    return (
      <div className="page-wrap py-16">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  if (!product)
    return (
      <div className="page-wrap py-16">
        <ErrorState message="Product not found." />
      </div>
    );

  return (
    <div className="page-wrap py-10">
      {/* Breadcrumb */}
      <nav
        className="mb-8 flex items-center gap-1 text-xs text-ink-soft"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition-colors hover:text-accent-deep">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/shop" className="transition-colors hover:text-accent-deep">
          Shop
        </Link>
        <ChevronRight className="size-3" />
        <span className="truncate font-medium text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="rise-in">
          <ProductImage
            src={images[activeImage]?.url}
            alt={product.name}
            className="aspect-[4/5] w-full rounded-3xl border border-line"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {images.length > 1 ? (
            <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={activeImage === i}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden rounded-xl border-2 bg-paper-deep transition-colors duration-300",
                    activeImage === i
                      ? "border-accent"
                      : "border-transparent hover:border-line",
                  )}
                >
                  <ProductImage
                    src={img.url}
                    alt={img.alt || `${product.name} ${i + 1}`}
                    className="h-full w-full"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div className="rise-in flex flex-col gap-6" style={{ animationDelay: "80ms" }}>
          <div>
            {product.categories?.[0]?.category?.name ? (
              <Link
                href={`/category/${product.categories[0].categoryId}`}
                className="eyebrow"
              >
                {product.categories[0].category.name}
              </Link>
            ) : null}
            <h1 className="display-title mt-2 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Price amount={price} oldAmount={oldPrice} className="text-2xl" />
            {discount ? <Badge variant="sale">-{discount}%</Badge> : null}
            {outOfStock ? (
              <Badge>Out of stock</Badge>
            ) : (
              <Badge variant="success">In stock · {stock}</Badge>
            )}
          </div>

          {product.description ? (
            <p className="text-sm leading-relaxed text-ink-soft">
              {product.description}
            </p>
          ) : null}

          {/* Variants */}
          {variants.length > 0 ? (
            <div className="space-y-5 border-t border-line pt-6">
              <div>
                <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                  {variant ? `Variant: ${variant.name}` : "Select variant"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setVariant(v);
                        setSubVariant(undefined);
                        setActiveImage(0);
                      }}
                      aria-pressed={variant?.id === v.id}
                      className={cn(
                        "rounded-sm border px-4 py-2 text-sm font-medium transition-all duration-300",
                        variant?.id === v.id
                          ? "border-ink bg-ink text-paper"
                          : "border-line bg-surface text-ink hover:border-ink",
                      )}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              {variant?.subVariants && variant.subVariants.length > 0 ? (
                <div>
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                    {subVariant
                      ? `Size: ${subVariant.size ?? "Standard"}`
                      : "Select size"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variant.subVariants.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        disabled={s.stock <= 0}
                        onClick={() => setSubVariant(s)}
                        aria-pressed={subVariant?.id === s.id}
                        className={cn(
                          "rounded-sm border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40",
                          subVariant?.id === s.id
                            ? "border-ink bg-ink text-paper"
                            : "border-line bg-surface text-ink hover:border-ink",
                        )}
                      >
                        {s.size ?? "Standard"}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Quantity + actions */}
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <div className="inline-flex items-center rounded-sm border border-line bg-surface">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex size-11 items-center justify-center text-ink-soft transition-colors duration-300 hover:text-accent-deep"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span
                className="w-10 text-center text-sm font-semibold tabular-nums"
                aria-live="polite"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                disabled={qty >= stock}
                className="flex size-11 items-center justify-center text-ink-soft transition-colors duration-300 hover:text-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              onClick={handleAdd}
              disabled={outOfStock}
              className="flex-1 rounded-sm"
              size="lg"
            >
              <ShoppingBag className="size-4" />
              {outOfStock ? "Out of stock" : "Add to cart"}
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={outOfStock}
              variant="outline"
              className="rounded-sm"
              size="lg"
            >
              Buy now
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 gap-3 border-t border-line pt-6 sm:grid-cols-3">
            {[
              { icon: Truck, label: "Fast delivery" },
              { icon: RefreshCw, label: "Easy returns" },
              { icon: ShieldCheck, label: "Secure checkout" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 text-sm text-ink-soft"
              >
                <span className="flex size-9 items-center justify-center rounded-sm bg-accent-tint text-accent-deep">
                  <Icon className="size-4" />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 ? (
        <section className="mt-20">
          <SectionHeading
            eyebrow="Keep exploring"
            title="You may also like"
            viewAllHref="/shop"
          />
          {related.isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <ProductGrid products={relatedProducts} />
          )}
        </section>
      ) : null}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="page-wrap py-10">
      <div className="grid gap-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-5">
          <Skeleton className="h-4 w-24 rounded-sm" />
          <Skeleton className="h-10 w-3/4 rounded-2xl" />
          <Skeleton className="h-8 w-32 rounded-sm" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-sm" />
        </div>
      </div>
    </div>
  );
}

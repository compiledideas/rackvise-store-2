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
import { motion } from "motion/react";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
    return <ErrorState message="This product could not be found." />;
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

  const images = product?.images ?? [];
  const variants = product?.variants ?? [];

  const price = product
    ? resolvePrice(product.price, variant, subVariant)
    : 0;
  const stock = product
    ? resolveStock(product.stock, variant, subVariant)
    : 0;
  const outOfStock = stock <= 0;
  const oldPrice = variant || subVariant ? undefined : product?.oldPrice ?? undefined;

  // Related products by first category
  const relatedCategoryId = product?.categories?.[0]?.categoryId;
  const related = useStorefrontProducts(
    { categoryId: relatedCategoryId, limit: 5, sort: "createdAt-desc" },
    { enabled: !!relatedCategoryId },
  );
  const relatedProducts = (related.data?.data ?? []).filter(
    (p) => p.id !== id,
  );

  const handleAdd = () => {
    if (!product) return;
    if (outOfStock) {
      toast.error("This product is out of stock");
      return;
    }
    if (variants.length > 0 && !variant) {
      toast.error("Please select a variant first");
      return;
    }
    addToCart(product, variant, subVariant, qty);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/cart");
  };

  if (isLoading) return <ProductSkeleton />;
  if (isError)
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  if (!product)
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16">
        <ErrorState message="Product not found." />
      </div>
    );

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-gray-400">
        <Link href="/" className="hover:text-shop_dark_green hoverEffect">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-shop_dark_green hoverEffect">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ProductImage
              src={images[activeImage]?.url}
              alt={product.name}
              className="aspect-square w-full rounded-3xl border border-gray-100"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
          {images.length > 1 ? (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-shop_light_bg hoverEffect",
                    activeImage === i
                      ? "border-shop_dark_green"
                      : "border-transparent",
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
        <div className="flex flex-col gap-5">
          <div>
            {product.categories?.[0]?.category?.name ? (
              <Link
                href={`/category/${product.categories[0].categoryId}`}
                className="text-xs font-semibold uppercase tracking-wide text-shop_light_green hoverEffect"
              >
                {product.categories[0].category.name}
              </Link>
            ) : null}
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Price amount={price} oldAmount={oldPrice} className="text-2xl" />
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                outOfStock
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700",
              )}
            >
              {outOfStock ? "Out of stock" : `In stock (${stock})`}
            </span>
          </div>

          {product.description ? (
            <p className="text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          ) : null}

          {/* Variants */}
          {variants.length > 0 ? (
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                      }}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium hoverEffect",
                        variant?.id === v.id
                          ? "border-shop_dark_green bg-shop_dark_green text-white"
                          : "border-gray-200 text-gray-700 hover:border-shop_dark_green",
                      )}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              {variant?.subVariants && variant.subVariants.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm font-medium hoverEffect disabled:cursor-not-allowed disabled:opacity-40",
                          subVariant?.id === s.id
                            ? "border-shop_dark_green bg-shop_dark_green text-white"
                            : "border-gray-200 text-gray-700 hover:border-shop_dark_green",
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
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-5">
            <div className="inline-flex items-center rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:text-shop_dark_green hoverEffect"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                disabled={qty >= stock}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:text-shop_dark_green hoverEffect disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAdd}
              disabled={outOfStock}
              className="flex-1 rounded-full"
              size="lg"
            >
              <ShoppingBag className="h-4 w-4" />
              {outOfStock ? "Out of stock" : "Add to cart"}
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={outOfStock}
              variant="outline"
              className="rounded-full"
              size="lg"
            >
              Buy now
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
            {[
              { icon: Truck, label: "Fast delivery" },
              { icon: RefreshCw, label: "Easy returns" },
              { icon: ShieldCheck, label: "Secure checkout" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <Icon className="h-5 w-5 text-shop_orange" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 ? (
        <section className="mt-16">
          <SectionHeading title="You may also like" viewAllHref="/shop" />
          {related.isLoading ? (
            <ProductGridSkeleton count={5} />
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
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

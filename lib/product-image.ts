import type { Product } from "@rackvise/storefront-sdk";

// Structural so partial product shapes (e.g. collage tiles) also work.
type WithImages = {
  images?: { url: string }[] | null;
  variants?: { images?: { url: string }[] | null }[] | null;
};

/**
 * The image a product should be advertised with: the product's own first
 * image, falling back to the first variant's image when the merchant hasn't
 * uploaded product-level photos.
 */
export function primaryProductImage(
  product: WithImages | Product | null | undefined,
): string | undefined {
  if (!product) return undefined;
  return (
    product.images?.[0]?.url ?? product.variants?.[0]?.images?.[0]?.url
  );
}

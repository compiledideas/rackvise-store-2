import Image from "next/image";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  sizes?: string;
}

/**
 * Product image with a graceful placeholder when none is present.
 * `cover` fills the frame (default — best for photos), `contain` letterboxes
 * the whole image inside the frame (best for diagrams/logos).
 */
export function ProductImage({
  src,
  alt,
  className,
  imageClassName,
  priority,
  fit = "cover",
  sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-paper-deep",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            fit === "contain" ? "object-contain p-3" : "object-cover",
            imageClassName,
          )}
        />
      ) : (
        <Package
          className="size-10 text-ink-soft/40"
          strokeWidth={1.5}
          aria-label={alt}
        />
      )}
    </div>
  );
}

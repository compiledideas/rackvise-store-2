import Image from "next/image";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

/** Renders a product image with a graceful placeholder when none is present. */
export function ProductImage({
  src,
  alt,
  className,
  imageClassName,
  priority,
  sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw",
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-shop_light_bg",
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
          className={cn("object-contain p-2 hoverEffect", imageClassName)}
        />
      ) : (
        <Package className="h-10 w-10 text-gray-300" strokeWidth={1.5} />
      )}
    </div>
  );
}

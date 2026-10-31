"use client";

import Link from "next/link";
import Image from "next/image";
import { useStorefrontConfig } from "@rackvise/storefront-sdk";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
  tone = "default",
}: {
  className?: string;
  size?: "md" | "lg";
  tone?: "default" | "inverted";
}) {
  const { data: config } = useStorefrontConfig({ staleTime: 5 * 60_000 });
  const name = config?.name ?? "Rackvise";
  // Uppercase two-tone wordmark: first word ink, last word accent.
  const words = name.trim().split(/\s+/);
  const first = words.slice(0, -1).join(" ");
  const last = words[words.length - 1];

  return (
    <Link
      href="/"
      aria-label={`${name} — home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      {config?.logoUrl ? (
        <Image
          src={config.logoUrl}
          alt={name}
          width={0}
          height={0}
          sizes="180px"
          className={cn(
            "w-auto object-contain",
            size === "lg" ? "h-10" : "h-8",
          )}
        />
      ) : (
        <>
          <span className="size-2.5 shrink-0 bg-accent transition-transform duration-300 group-hover:rotate-45" />
          <span
            className={cn(
              "display-title tracking-tight",
              size === "lg" ? "text-2xl" : "text-lg",
              tone === "inverted" ? "text-paper" : "text-ink",
            )}
          >
            {first ? `${first} ` : ""}
            <span className="text-accent">{last}</span>
          </span>
        </>
      )}
    </Link>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  viewAllHref?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  viewAllHref,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-6 flex items-end justify-between gap-4",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shop_light_green">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="shrink-0 text-sm font-semibold text-shop_dark_green hover:text-shop_light_green hoverEffect"
        >
          View all →
        </Link>
      ) : null}
    </div>
  );
}

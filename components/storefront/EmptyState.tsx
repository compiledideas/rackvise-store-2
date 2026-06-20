import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-shop_light_pink text-shop_dark_green">
          <Icon className="h-7 w-7" />
        </span>
      ) : null}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

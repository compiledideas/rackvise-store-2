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
        "flex flex-col items-center justify-center border border-dashed border-line bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="mb-4 flex size-14 items-center justify-center bg-accent-tint text-accent-deep">
          <Icon className="size-7" strokeWidth={1.75} />
        </span>
      ) : null}
      <h3 className="display-title text-lg text-ink">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

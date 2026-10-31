import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-[color,background-color,border-color] [&>svg]:size-3 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-paper",
        accent: "border-transparent bg-accent text-white dark:text-[#131009]",
        secondary: "border-transparent bg-paper-deep text-ink",
        sale: "border-transparent bg-sale/10 text-sale",
        success: "border-transparent bg-success/10 text-success",
        warn: "border-transparent bg-warn/10 text-warn",
        info: "border-transparent bg-info/10 text-info",
        muted: "border-transparent bg-muted text-muted-foreground",
        destructive: "border-transparent bg-destructive text-white",
        outline: "border-line text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

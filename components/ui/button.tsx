import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold uppercase tracking-[0.08em] transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-paper hover:bg-accent hover:text-white dark:bg-ink dark:text-paper dark:hover:bg-accent dark:hover:text-[#131009]",
        accent:
          "bg-accent text-white hover:bg-accent-deep dark:text-[#131009] dark:hover:text-[#131009]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper dark:hover:bg-ink dark:hover:text-paper",
        secondary:
          "bg-paper-deep text-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-paper-deep",
        link: "text-accent-deep underline-offset-4 hover:underline normal-case tracking-normal",
      },
      size: {
        default: "h-10 px-5",
        xs: "h-6 gap-1 px-2 text-[11px]",
        sm: "h-8 gap-1.5 px-3 text-xs",
        lg: "h-12 px-7",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-xs": "size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Boxes } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-shop_dark_green text-white">
        <Boxes className="h-5 w-5" />
      </span>
      <span
        className={cn(
          "text-lg font-black uppercase tracking-tight text-shop_dark_green",
          className,
        )}
      >
        Rack<span className="text-shop_light_green">vise</span>
      </span>
    </Link>
  );
}

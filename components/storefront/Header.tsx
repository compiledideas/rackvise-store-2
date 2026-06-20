"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { navItems } from "@/constants/nav";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-4 px-4">
        {/* Left: logo + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo />
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-semibold capitalize hoverEffect",
                  active
                    ? "text-shop_dark_green"
                    : "text-gray-600 hover:text-shop_dark_green",
                )}
              >
                {item.title}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-shop_light_green transition-all duration-300",
                    active ? "w-full" : "w-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: search + cart */}
        <div className="flex items-center gap-1">
          <form
            onSubmit={submitSearch}
            className="hidden items-center lg:flex"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="h-10 w-56 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-shop_light_green focus:bg-white"
              />
            </div>
          </form>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 lg:hidden"
            onClick={() => router.push("/shop")}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <CartButton />
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen ? (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-screen-xl flex-col px-4 py-2">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-semibold capitalize hoverEffect",
                    active
                      ? "bg-shop_light_pink text-shop_dark_green"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import {
  useStorefrontCategories,
  useStorefrontConfig,
} from "@rackvise/storefront-sdk";
import { navItems } from "@/constants/nav";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: config } = useStorefrontConfig({ staleTime: 5 * 60_000 });
  const { data: categories } = useStorefrontCategories();

  const announcement =
    config?.showAnnouncement && config.announcementEN
      ? config.announcementEN
      : null;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    setMobileOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const searchInput = (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the catalogue…"
        aria-label="Search products"
        className="h-10 w-full rounded-sm border border-line bg-surface ps-9 pe-3 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-ink-soft focus:border-accent"
      />
    </div>
  );

  return (
    <>
      {/* Announcement ticker (scrolls away) */}
      {announcement ? (
        <div className="bg-accent text-white dark:text-[#131009]">
          <p className="page-wrap py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em]">
            {announcement}
          </p>
        </div>
      ) : null}

      {/* Main bar — nav / wordmark / actions (sticky) */}
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="page-wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left: nav (desktop) / burger (mobile) */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center text-ink transition-colors duration-300 hover:bg-paper-deep md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <nav
              className="hidden items-center gap-6 md:flex"
              aria-label="Primary"
            >
              {navItems.slice(0, 3).map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  active={isActive(item.href)}
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center: wordmark */}
          <Logo />

          {/* Right: nav + actions */}
          <div className="flex items-center justify-end gap-5">
            <nav
              className="hidden items-center gap-6 lg:flex"
              aria-label="Secondary"
            >
              {navItems.slice(3).map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  active={isActive(item.href)}
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>
            <form
              onSubmit={submitSearch}
              className="hidden w-48 items-center xl:flex"
            >
              {searchInput}
            </form>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center text-ink transition-colors duration-300 hover:bg-paper-deep xl:hidden"
              onClick={() => router.push("/shop")}
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>
            <ThemeToggle className="inline-flex size-10 items-center justify-center text-ink transition-colors duration-300 hover:bg-paper-deep" />
            <CartButton />
          </div>
        </div>
      </header>

      {/* Categories rail (desktop, scrolls away) */}
      {categories && categories.length > 0 ? (
        <div className="hidden border-b border-line bg-paper md:block">
          <nav
            className="page-wrap flex items-center gap-7 overflow-x-auto py-2.5 scrollbar-hide"
            aria-label="Categories"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Shop
            </span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={cn(
                  "shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
                  pathname === `/category/${cat.id}`
                    ? "text-accent"
                    : "text-ink hover:text-accent",
                )}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fade-in border-b border-line bg-surface md:hidden">
          <div className="page-wrap flex flex-col gap-4 py-5">
            <form onSubmit={submitSearch}>{searchInput}</form>
            <nav className="flex flex-col" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "border-b border-line py-3 text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-300 last:border-b-0",
                    isActive(item.href) ? "text-accent" : "text-ink",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            {categories && categories.length > 0 ? (
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative py-1 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
        active ? "text-accent" : "text-ink hover:text-accent",
      )}
    >
      <span className="absolute -start-3 top-1/2 size-1.5 -translate-y-1/2 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {active ? (
        <span className="absolute -start-3 top-1/2 size-1.5 -translate-y-1/2 bg-accent" />
      ) : null}
      {children}
    </Link>
  );
}

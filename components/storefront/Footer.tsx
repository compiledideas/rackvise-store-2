import Link from "next/link";
import { footerLinks } from "@/constants/nav";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <Logo />
            <p className="max-w-sm text-sm text-gray-500">
              A guest-friendly storefront built on the Rackvise platform. Browse
              the catalog, fill your cart, and check out — no account required.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h4 className="text-sm font-semibold text-gray-900">
                {group.heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-shop_dark_green hoverEffect"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Rackvise Store. Built with the
          Storefront SDK.
        </div>
      </div>
    </footer>
  );
}

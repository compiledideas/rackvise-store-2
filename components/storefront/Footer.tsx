"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useStorefrontConfig } from "@rackvise/storefront-sdk";
import { footerLinks } from "@/constants/nav";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const { data: config } = useStorefrontConfig({ staleTime: 5 * 60_000 });
  const storeName = config?.name ?? "Rackvise Store";

  const contact = [
    config?.contactPhone
      ? { icon: Phone, label: config.contactPhone, href: `tel:${config.contactPhone}` }
      : null,
    config?.contactEmail
      ? { icon: Mail, label: config.contactEmail, href: `mailto:${config.contactEmail}` }
      : null,
    config?.contactAddress
      ? { icon: MapPin, label: config.contactAddress, href: undefined }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <footer className="mt-auto border-t border-line bg-ink text-paper">
      <div className="page-wrap py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="flex flex-col items-start gap-5">
            <Logo size="lg" tone="inverted" />
            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              {config?.taglineEN ??
                "A guest-friendly storefront built on the Rackvise platform. Browse the catalogue, fill your cart, and check out — no account required."}
            </p>
            <SocialLinks
              links={config?.socialLinks}
              itemClassName="border-paper/20 text-paper/70 hover:border-accent hover:bg-accent hover:text-white dark:hover:text-[#131009]"
            />
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-bright">
                {group.heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 transition-colors duration-300 hover:text-accent-bright"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-bright">
              Get in touch
            </h4>
            {contact.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {contact.map(({ icon: Icon, label, href }) => (
                  <li key={label} className="flex items-start gap-2.5 text-sm">
                    <Icon className="mt-0.5 size-4 shrink-0 text-accent-bright" />
                    {href ? (
                      <a
                        href={href}
                        className="text-paper/70 transition-colors duration-300 hover:text-accent-bright"
                      >
                        {label}
                      </a>
                    ) : (
                      <span className="text-paper/70">{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-xs text-sm text-paper/60">
                Questions about an order? Reach out through any of our stores
                or social channels.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="page-wrap flex flex-col items-center justify-between gap-2 py-5 text-[11px] uppercase tracking-[0.14em] text-paper/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <p>
            Powered by <span className="font-bold text-paper/70">Rackvise</span> · Guest
            checkout
          </p>
        </div>
      </div>
    </footer>
  );
}

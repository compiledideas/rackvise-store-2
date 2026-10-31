"use client";

import {
  Facebook,
  Instagram,
  MessageCircle,
  Music2,
  Twitter,
} from "lucide-react";
import type { StoreSocialLinks } from "@rackvise/storefront-sdk";
import { cn } from "@/lib/utils";

type SocialKey = keyof StoreSocialLinks;

const socialMeta: Record<
  SocialKey,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  instagram: { label: "Instagram", icon: Instagram },
  facebook: { label: "Facebook", icon: Facebook },
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  tiktok: { label: "TikTok", icon: Music2 },
  twitter: { label: "Twitter", icon: Twitter },
};

const order: SocialKey[] = [
  "instagram",
  "facebook",
  "whatsapp",
  "tiktok",
  "twitter",
];

/** Icon links for the social profiles configured on the store. */
export function SocialLinks({
  links,
  className,
  itemClassName,
}: {
  links?: StoreSocialLinks | null;
  className?: string;
  itemClassName?: string;
}) {
  const active = order.filter((key) => !!links?.[key]);
  if (active.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {active.map((key) => {
        const { label, icon: Icon } = socialMeta[key];
        return (
          <a
            key={key}
            href={links?.[key] as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              "flex size-9 items-center justify-center rounded-sm border transition-colors duration-300",
              itemClassName,
            )}
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

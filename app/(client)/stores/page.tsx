"use client";

import { useStorefrontPointOfSells } from "@rackvise/storefront-sdk";
import { Store, MapPin, Phone, Mail, Clock } from "lucide-react";
import { ErrorState } from "@/components/storefront/QueryState";
import { EmptyState } from "@/components/storefront/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

export default function StoresPage() {
  const { data, isLoading, isError, refetch } = useStorefrontPointOfSells();

  return (
    <div className="page-wrap py-14">
      <header className="mb-12 border-b border-line pb-8 text-center">
        <p className="eyebrow">Visit us</p>
        <h1 className="display-title mt-3 text-[clamp(2.2rem,6vw,3.8rem)] leading-[0.9] text-ink">Our stores</h1>
        <p className="text-base text-muted-foreground">
          Visit our physical locations. Find store addresses, hours, and
          contact info.
        </p>
      </header>

      <div className="mt-12">
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No stores available"
            description="We don't have any physical locations listed yet."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.map((pos) => (
              <article
                key={pos.id}
                className="flex flex-col gap-5 rounded-2xl border border-line bg-card p-6"
              >
                <div className="space-y-1.5">
                  <h2 className="display-title text-lg font-semibold text-ink">
                    {pos.name}
                  </h2>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-accent-deep" />
                    <span>
                      {pos.address}
                      {pos.city ? `, ${pos.city}` : ""}
                      {pos.country ? `, ${pos.country}` : ""}
                    </span>
                  </p>
                </div>

                <dl className="space-y-3 text-sm">
                  {pos.phone ? (
                    <div className="space-y-0.5">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                        <Phone className="size-3.5 text-accent-deep" />
                        Contact
                      </dt>
                      <dd>
                        <a
                          href={`tel:${pos.phone}`}
                          className="font-medium text-ink transition-colors hover:text-accent-deep"
                        >
                          {pos.phone}
                        </a>
                      </dd>
                    </div>
                  ) : null}

                  {pos.email ? (
                    <div className="space-y-0.5">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                        <Mail className="size-3.5 text-accent-deep" />
                        Email
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${pos.email}`}
                          className="font-medium text-ink transition-colors hover:text-accent-deep"
                        >
                          {pos.email}
                        </a>
                      </dd>
                    </div>
                  ) : null}

                  {pos.workingHours &&
                  Object.keys(pos.workingHours).length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                        <Clock className="size-3.5 text-accent-deep" />
                        Hours
                      </dt>
                      <dd>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(pos.workingHours).map(
                            ([day, hours]) => {
                              const wh = hours as { open?: string; close?: string };
                              return (
                                <li
                                  key={day}
                                  className="flex justify-between gap-3 capitalize"
                                >
                                  <span className="text-muted-foreground">
                                    {day}
                                  </span>
                                  <span className="font-medium text-ink">
                                    {wh.open} – {wh.close}
                                  </span>
                                </li>
                              );
                            },
                          )}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

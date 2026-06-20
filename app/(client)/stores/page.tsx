"use client";

import { useStorefrontPointOfSells } from "@rackvise/storefront-sdk";
import { Store, MapPin, Phone, Mail, Clock } from "lucide-react";
import { ErrorState } from "@/components/storefront/QueryState";
import { EmptyState } from "@/components/storefront/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

export default function StoresPage() {
  const { data, isLoading, isError, refetch } = useStorefrontPointOfSells();

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-shop_light_pink text-shop_dark_green">
          <Store className="h-6 w-6" />
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Our stores
        </h1>
        <p className="text-base text-gray-500">
          Visit our physical locations. Find store addresses, hours, and contact
          info.
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
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {pos.name}
                  </h2>
                  <p className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-shop_dark_green" />
                    <span>
                      {pos.address}
                      {pos.city ? `, ${pos.city}` : ""}
                      {pos.country ? `, ${pos.country}` : ""}
                    </span>
                  </p>
                </div>

                <dl className="space-y-2 text-sm">
                  {pos.phone ? (
                    <div className="space-y-0.5">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                        <Phone className="h-3.5 w-3.5 text-shop_dark_green" />
                        Contact
                      </dt>
                      <dd>
                        <a
                          href={`tel:${pos.phone}`}
                          className="font-medium text-gray-900 hover:text-shop_dark_green"
                        >
                          {pos.phone}
                        </a>
                      </dd>
                    </div>
                  ) : null}

                  {pos.email ? (
                    <div className="space-y-0.5">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                        <Mail className="h-3.5 w-3.5 text-shop_dark_green" />
                        Email
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${pos.email}`}
                          className="font-medium text-gray-900 hover:text-shop_dark_green"
                        >
                          {pos.email}
                        </a>
                      </dd>
                    </div>
                  ) : null}

                  {pos.workingHours &&
                    Object.keys(pos.workingHours).length > 0 ? (
                    <div className="space-y-1 pt-1">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                        <Clock className="h-3.5 w-3.5 text-shop_dark_green" />
                        Hours
                      </p>
                      <ul className="space-y-0.5 text-sm text-gray-700">
                        {Object.entries(pos.workingHours).map(
                          ([day, hours]) => {
                            const wh = hours as { open?: string; close?: string };
                            return (
                              <li
                                key={day}
                                className="flex justify-between gap-3 capitalize"
                              >
                                <span className="text-gray-500">{day}</span>
                                <span className="font-medium">
                                  {wh.open} - {wh.close}
                                </span>
                              </li>
                            );
                          },
                        )}
                      </ul>
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

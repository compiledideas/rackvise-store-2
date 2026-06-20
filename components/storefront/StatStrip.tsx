"use client";

import { useStorefrontStats } from "@rackvise/storefront-sdk";
import { PackageCheck, Boxes, Truck, ShoppingBag } from "lucide-react";

export function StatStrip() {
  const { data, isLoading } = useStorefrontStats();

  const stats = [
    {
      label: "Products",
      value: data?.totalProducts,
      icon: Boxes,
    },
    {
      label: "In stock",
      value: data?.totalStock,
      icon: PackageCheck,
    },
    {
      label: "Orders delivered",
      value: data?.deliveredOrders,
      icon: Truck,
    },
    {
      label: "Online orders",
      value: data?.onlineOrders,
      icon: ShoppingBag,
    },
  ];

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-shop_light_pink text-shop_dark_green">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold tabular-nums text-gray-900">
                {isLoading ? "—" : (value ?? 0).toLocaleString("en-US")}
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

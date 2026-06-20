import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { StorefrontProviders } from "@/components/providers/StorefrontProviders";

export const metadata: Metadata = {
  title: {
    template: "%s · Rackvise Store",
    default: "Rackvise Store",
  },
  description: "Shop the full catalog and check out as a guest.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <StorefrontProviders>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: "#063c28", color: "#fff" },
            }}
          />
        </StorefrontProviders>
      </body>
    </html>
  );
}

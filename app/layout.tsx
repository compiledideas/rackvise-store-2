import "./globals.css";
import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { StorefrontProviders } from "@/components/providers/StorefrontProviders";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s · Rackvise Store",
    default: "Rackvise Store",
  },
  description: "Shop the full catalog and check out as a guest.",
};

// Applies the persisted theme before first paint to avoid a flash of the
// wrong colour scheme.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("rv-theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${grotesk.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <StorefrontProviders>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#181310",
                color: "#f6f1e7",
                borderRadius: "2px",
                fontFamily: "var(--font-grotesk), sans-serif",
              },
            }}
          />
        </StorefrontProviders>
      </body>
    </html>
  );
}

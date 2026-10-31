import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrap flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <p className="display-title text-7xl font-semibold text-accent">404</p>
      <h1 className="display-title mt-4 text-2xl font-semibold text-ink">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for may have moved or never existed. Head
        back to the store to keep shopping.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-sm bg-ink px-6 py-2.5 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-accent-deep"
      >
        Back to home
      </Link>
    </div>
  );
}

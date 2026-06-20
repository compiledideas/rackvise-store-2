import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-6xl font-black text-shop_dark_green">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        The page you&apos;re looking for may have moved or never existed. Head
        back to the store to keep shopping.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-shop_dark_green px-6 py-2.5 text-sm font-semibold text-white hoverEffect hover:bg-shop_btn_dark_green"
      >
        Back to home
      </Link>
    </div>
  );
}

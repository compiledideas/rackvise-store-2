export interface NavItem {
  title: string;
  href: string;
}

// Primary navigation. Guest-only storefront — no account links.
export const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop" },
  { title: "Promos", href: "/promos" },
  { title: "About", href: "/about" },
  { title: "Stores", href: "/stores" },
  { title: "FAQ", href: "/faq" },
];

export const footerLinks: { heading: string; links: NavItem[] }[] = [
  {
    heading: "Shop",
    links: [
      { title: "All products", href: "/shop" },
      { title: "Promotions", href: "/promos" },
      { title: "Cart", href: "/cart" },
      { title: "Checkout", href: "/checkout" },
    ],
  },
  {
    heading: "Company",
    links: [
      { title: "About us", href: "/about" },
      { title: "Our stores", href: "/stores" },
      { title: "FAQ", href: "/faq" },
    ],
  },
];

import Link from "next/link";
import { Wordmark } from "./logo";

const nav = [
  { label: "Catalog", href: "#catalog" },
  { label: "Story", href: "#story" },
  { label: "Instagram", href: "#instagram" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="TSOMI home">
          <Wordmark className="text-2xl" />
        </Link>

        <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-wide md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-terracotta"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold transition-colors hover:bg-ink hover:text-cream"
        >
          Cart (0)
        </button>
      </div>
    </header>
  );
}

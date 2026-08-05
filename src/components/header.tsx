import Link from "next/link";
import { Wordmark } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { SocialLinks } from "./social-links";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export function Header({ locale, dict }: { locale: LocaleId; dict: Dictionary }) {
  const nav = [
    { label: dict.nav.catalog, href: `/${locale}/catalog` },
    { label: dict.nav.story, href: `/${locale}#story` },
    { label: dict.nav.instagram, href: `/${locale}#instagram` },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-tan/50 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-330 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={`/${locale}`} aria-label="TSOMI home">
          <Wordmark className="text-[1.6rem]" />
        </Link>

        <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-[0.15em] md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-1 transition-colors hover:text-terracotta after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-terracotta after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SocialLinks size="sm" />
          </div>
          <LanguageSwitcher locale={locale} label={dict.language.label} />
          <button
            type="button"
            className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold transition-colors hover:bg-ink hover:text-cream"
          >
            {dict.nav.cart}
          </button>
        </div>
      </div>
    </header>
  );
}

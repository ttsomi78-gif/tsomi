import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export function Header({ locale, dict }: { locale: LocaleId; dict: Dictionary }) {
  const nav = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.catalog, href: `/${locale}/catalog` },
    { label: dict.nav.story, href: `/${locale}/history` },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-tan/70 bg-sand/95 shadow-md shadow-ink/10 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-330 items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          aria-label="TSOMI home"
          className="rounded-md transition-opacity hover:opacity-80"
        >
          <Image
            src="/brand/logo-wordmark.png"
            alt="TSOMI"
            width={544}
            height={121}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </Link>

        {/* nav + actions grouped on the right */}
        <div className="flex items-center gap-6 lg:gap-10">
          <nav className="hidden gap-6 text-sm font-semibold uppercase tracking-[0.15em] md:flex lg:gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-1 transition-colors hover:text-terracotta after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-terracotta after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} label={dict.language.label} />
            <Link
              href={`/${locale}/catalog`}
              className="hidden rounded-full bg-ink px-5 py-2 text-sm font-bold uppercase tracking-wide text-cream shadow-md shadow-ink/15 transition-all hover:bg-terracotta hover:shadow-lg hover:shadow-terracotta/25 md:inline-flex"
            >
              {dict.nav.shop}
            </Link>
            <MobileMenu
              items={nav}
              shopHref={`/${locale}/catalog`}
              shopLabel={dict.nav.shop}
              menuLabel={dict.nav.menu}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

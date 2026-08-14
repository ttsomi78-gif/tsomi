import Link from "next/link";
import { Wordmark } from "./logo";
import { SocialLinks } from "./social-links";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export function Footer({ locale, dict }: { locale: LocaleId; dict: Dictionary }) {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta/60 to-transparent"
      />
      <div className="relative mx-auto max-w-330 px-4 pt-16 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-12">
          {/* brand */}
          <div className="max-w-xs">
            <Wordmark className="text-4xl" />
            <p className="font-georgian mt-3 text-lg tracking-[0.3em] text-cream/40">
              ცომი
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream/50">
              {dict.hero.sub}
            </p>
          </div>

          {/* nav columns */}
          <nav className="flex gap-16 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/40">
                {dict.footer.shop}
              </span>
              <Link
                href={`/${locale}/catalog`}
                className="text-cream/70 transition-colors hover:text-yolk"
              >
                {dict.footer.catalog}
              </Link>
              <Link
                href={`/${locale}/history`}
                className="text-cream/70 transition-colors hover:text-yolk"
              >
                {dict.footer.story}
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/40">
                {dict.footer.social}
              </span>
              <SocialLinks />
            </div>
          </nav>
        </div>

        {/* giant watermark */}
        <p
          aria-hidden="true"
          className="font-display pointer-events-none mt-10 select-none whitespace-nowrap text-center text-[19vw] uppercase leading-none tracking-wide text-cream/5 lg:text-[13rem]"
        >
          TSOMI
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 py-6 text-xs font-semibold uppercase tracking-[0.25em] text-cream/40">
          <span>{dict.footer.copyright}</span>
          <span>{dict.footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

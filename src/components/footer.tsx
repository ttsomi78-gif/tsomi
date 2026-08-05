import Link from "next/link";
import { LogoLockup } from "./logo";
import { SocialLinks } from "./social-links";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export function Footer({ locale, dict }: { locale: LocaleId; dict: Dictionary }) {
  return (
    <footer className="relative border-t border-tan/60 bg-blush py-14 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent"
      />
      <div className="mx-auto max-w-330 px-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <LogoLockup className="items-start! text-left!" />

          <nav className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/40">
                {dict.footer.shop}
              </span>
              <Link
                href={`/${locale}/catalog`}
                className="transition-colors hover:text-terracotta hover:underline hover:decoration-terracotta/50 hover:underline-offset-4"
              >
                {dict.footer.catalog}
              </Link>
              <Link
                href={`/${locale}#story`}
                className="transition-colors hover:text-terracotta hover:underline hover:decoration-terracotta/50 hover:underline-offset-4"
              >
                {dict.footer.story}
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/40">
                {dict.footer.social}
              </span>
              <SocialLinks />
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-tan/60 pt-6 text-xs font-semibold uppercase tracking-[0.25em] text-ink/40">
          <span>{dict.footer.copyright}</span>
          <span>{dict.footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

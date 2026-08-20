import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "./social-links";
import { socialLinks } from "@/lib/social";
import { company } from "@/lib/company";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export function Footer({ locale, dict }: { locale: LocaleId; dict: Dictionary }) {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta/60 to-transparent"
      />
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-terracotta/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-330 px-4 pt-14 sm:px-6 lg:pt-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_auto] lg:gap-16">
          {/* brand — cream monochrome lockup on the dark ground */}
          <div className="max-w-xs sm:col-span-2 lg:col-span-1">
            <div className="inline-flex flex-col items-center">
              <Image
                src="/brand/logo-cream.png"
                alt="TSOMI — ცომი"
                width={560}
                height={238}
                className="h-24 w-auto opacity-90"
              />
              <span className="mt-4 text-[0.55rem] font-semibold uppercase tracking-[0.45em] [text-indent:0.45em] text-cream/40">
                Made in Georgia
              </span>
            </div>
          </div>

          {/* shop links */}
          <nav className="flex flex-col gap-3 text-sm lg:justify-self-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-yolk/80">
              {dict.footer.shop}
            </span>
            <Link
              href={`/${locale}/catalog`}
              className="w-fit text-cream/70 transition-colors hover:text-yolk"
            >
              {dict.footer.catalog}
            </Link>
            <Link
              href={`/${locale}/history`}
              className="w-fit text-cream/70 transition-colors hover:text-yolk"
            >
              {dict.footer.story}
            </Link>
          </nav>

          {/* info — the policy pages the bank's merchant review looks for */}
          <nav className="flex flex-col gap-3 text-sm lg:justify-self-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-yolk/80">
              {dict.footer.info}
            </span>
            {(
              [
                ["shipping", dict.footer.shipping],
                ["terms", dict.footer.terms],
                ["privacy", dict.footer.privacy],
                ["contact", dict.footer.contact],
              ] as const
            ).map(([slug, label]) => (
              <Link
                key={slug}
                href={`/${locale}/${slug}`}
                className="w-fit text-cream/70 transition-colors hover:text-yolk"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* social */}
          <div className="flex flex-col gap-3 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-yolk/80">
              {dict.footer.social}
            </span>
            <SocialLinks tone="light" />
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-1 w-fit text-cream/50 transition-colors hover:text-yolk"
            >
              @tsomi.streetwear
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 py-6 text-xs font-semibold uppercase tracking-[0.25em] text-cream/40">
          <span>
            {dict.footer.copyright} ·{" "}
            {locale === "ka" ? company.legalNameKa : company.legalName}
          </span>
          <span>{dict.footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

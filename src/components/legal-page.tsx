import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

/** One section of a policy page: a heading and a few short paragraphs. */
export type LegalSection = { heading: string; body: string[] };

export type LegalContent = {
  title: string;
  /** Short intro line under the title. */
  intro?: string;
  sections: LegalSection[];
  /** e.g. "Last updated: August 2026" in the page's language. */
  updated: string;
};

/**
 * Shared shell for the policy pages (terms, privacy, shipping, contact).
 * Deliberately plain: these pages exist for customers and the bank's
 * merchant review, not for showing off.
 */
export function LegalPage({
  locale,
  dict,
  content,
}: {
  locale: LocaleId;
  dict: Dictionary;
  content: LegalContent;
}) {
  return (
    <>
      <Header locale={locale} dict={dict} />
      <main>
        <div className="border-b border-tan/40 bg-blush/50">
          <div className="mx-auto max-w-330 px-4 py-8 sm:px-6 sm:py-10">
            <nav
              aria-label="Breadcrumb"
              className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45"
            >
              <Link
                href={`/${locale}`}
                className="transition-colors hover:text-terracotta"
              >
                {dict.nav.home}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink/70">{content.title}</span>
            </nav>
            <h1 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
              {content.title}
            </h1>
            {content.intro && (
              <p className="mt-3 max-w-2xl text-ink/60">{content.intro}</p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
          <div className="space-y-8">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-2 font-display text-xl uppercase tracking-wide">
                  {section.heading}
                </h2>
                <div className="space-y-2">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed text-ink/70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-tan/50 pt-6 text-sm text-ink/40">
            {content.updated}
          </p>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

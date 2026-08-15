import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CatalogGrid } from "@/components/catalog-grid";
import { getActiveProducts } from "@/db/queries";
import { getDictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Catalog — TSOMI",
  description:
    "The full TSOMI drop — khachapuri shoppers, khinkali tees, and more. Made in Georgia.",
};

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  const [products, dict] = await Promise.all([
    getActiveProducts(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main>
        {/* page head band */}
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
              <span className="text-ink/70">{dict.catalog.heading}</span>
            </nav>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
                {dict.catalog.heading}
              </h1>
              <p className="text-sm font-medium text-ink/45">
                {dict.catalog.itemCount.replace("{count}", String(products.length))}
              </p>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-330 px-4 pb-20 pt-6 sm:px-6">
          <CatalogGrid products={products} dict={dict} />
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

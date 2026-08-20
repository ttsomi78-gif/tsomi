import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CatalogGrid } from "@/components/catalog-grid";
import { getActiveProducts } from "@/db/queries";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import type { LocaleId, Product } from "@/lib/products";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  return buildPageMetadata("catalog", locale, "/catalog");
}

/**
 * Product list structured data — makes items eligible for Google's product
 * rich results (price, availability) on catalog searches.
 */
function structuredData(products: Product[], locale: LocaleId) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: `${siteUrl}${product.image}`,
        url: `${siteUrl}/${locale}/catalog`,
        brand: { "@type": "Brand", name: "TSOMI" },
        offers: {
          "@type": "Offer",
          price: product.price.toFixed(2),
          priceCurrency: "GEL",
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      },
    })),
  };
}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(products, locale)),
        }}
      />
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

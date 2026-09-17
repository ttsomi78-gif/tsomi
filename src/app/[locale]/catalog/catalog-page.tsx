import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CatalogGrid } from "@/components/catalog-grid";
import { getActiveProducts } from "@/db/queries";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteUrl } from "@/lib/site";
import type { CategoryId, LocaleId, Product } from "@/lib/products";

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
        url: `${siteUrl}/${locale}/product/${product.id}`,
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

/**
 * The catalog, shared by `/catalog` (everything) and `/catalog/<category>`
 * (one category preselected — the pills still switch client-side, so the
 * whole active catalog is loaded either way).
 */
export async function CatalogPageContent({
  locale,
  category,
}: {
  locale: LocaleId;
  category?: CategoryId;
}) {
  const [products, dict] = await Promise.all([
    getActiveProducts(locale),
    getDictionary(locale),
  ]);
  const shown = category
    ? products.filter((product) => product.category === category)
    : products;
  const heading = category ? dict.catalog.categories[category] : dict.catalog.heading;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(shown, locale)),
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
              {category ? (
                <>
                  <Link
                    href={`/${locale}/catalog`}
                    className="transition-colors hover:text-terracotta"
                  >
                    {dict.nav.catalog}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              ) : null}
              <span className="text-ink/70">{heading}</span>
            </nav>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
                {heading}
              </h1>
              <p className="text-sm font-medium text-ink/45">
                {dict.catalog.itemCount.replace("{count}", String(shown.length))}
              </p>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-330 px-4 pb-20 pt-6 sm:px-6">
          <CatalogGrid
            products={products}
            locale={locale}
            dict={dict}
            initialCategory={category}
          />
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

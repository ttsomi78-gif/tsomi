import type { Metadata } from "next";
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
        <section className="mx-auto max-w-330 px-4 pb-20 pt-12 sm:px-6">
          <div className="mb-10">
            <h1 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
              {dict.catalog.heading}
            </h1>
          </div>

          <CatalogGrid products={products} dict={dict} />
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

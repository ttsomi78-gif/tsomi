import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductView } from "./product-view";
import { getActiveProductById } from "@/db/queries";
import { getDictionary } from "@/i18n/get-dictionary";
import { getDeliveryFeeTetri } from "@/lib/orders";
import { formatGel, tetriToGel } from "@/lib/money";
import { getSiteUrl } from "@/lib/site";
import { locales, type LocaleId } from "@/lib/products";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await getActiveProductById(id, locale);
  if (!product) return { title: "Not found" };

  const siteUrl = getSiteUrl();
  const path = `/product/${id}`;
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
  );
  languages["x-default"] = `${siteUrl}/en${path}`;

  return {
    title: product.name,
    description: product.alt,
    alternates: { canonical: `${siteUrl}/${locale}${path}`, languages },
    openGraph: {
      type: "website",
      siteName: "TSOMI",
      title: `${product.name} — TSOMI`,
      description: product.alt,
      url: `${siteUrl}/${locale}${path}`,
      images: [{ url: product.image, alt: product.alt }],
    },
  };
}

/** Product rich-result data: price in GEL, live availability, brand. */
function structuredData(
  product: NonNullable<Awaited<ReturnType<typeof getActiveProductById>>>,
  locale: LocaleId,
) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image, ...product.images.map((image) => image.url)].map(
      (url) => `${siteUrl}${url}`,
    ),
    description: product.alt,
    brand: { "@type": "Brand", name: "TSOMI" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/${locale}/product/${product.id}`,
      price: product.price.toFixed(2),
      priceCurrency: "GEL",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: LocaleId; id: string }>;
}) {
  const { locale, id } = await params;
  const [product, dict] = await Promise.all([
    getActiveProductById(id, locale),
    getDictionary(locale),
  ]);
  if (!product) notFound();

  const deliveryNote = dict.checkout.deliveryNote.replace(
    "{amount}",
    formatGel(tetriToGel(getDeliveryFeeTetri())),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(product, locale)),
        }}
      />
      <Header locale={locale} dict={dict} />
      <main className="mx-auto max-w-330 px-4 pb-20 pt-6 sm:px-6 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45"
        >
          <Link href={`/${locale}`} className="transition-colors hover:text-terracotta">
            {dict.nav.home}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/${locale}/catalog`}
            className="transition-colors hover:text-terracotta"
          >
            {dict.nav.catalog}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-40 truncate text-ink/70 sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <ProductView
          product={product}
          locale={locale}
          dict={dict}
          deliveryNote={deliveryNote}
        />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

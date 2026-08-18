import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CheckoutForm } from "./checkout-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { getDeliveryFeeTetri } from "@/lib/orders";
import type { LocaleId } from "@/lib/products";

// Never cached: the delivery fee is read from the environment at request time,
// and a checkout page has no business being served from a shared cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — TSOMI",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

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
              <span className="text-ink/70">{dict.checkout.heading}</span>
            </nav>
            <h1 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
              {dict.checkout.heading}
            </h1>
          </div>
        </div>

        <section className="mx-auto max-w-330 px-4 pb-20 pt-8 sm:px-6">
          <CheckoutForm
            locale={locale}
            dict={dict}
            deliveryTetri={getDeliveryFeeTetri()}
          />
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

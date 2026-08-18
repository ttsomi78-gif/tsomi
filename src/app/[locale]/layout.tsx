import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { HtmlLangSync } from "@/components/html-lang-sync";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { getDeliveryFeeTetri } from "@/lib/orders";

// No generateStaticParams: the pages under /[locale] read the product catalog
// from the database, which isn't reachable during `docker build`. With ISR
// (`revalidate` on each page) they render on first request instead and are
// then cached — same performance, no build-time database dependency.

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <CartProvider>
      <HtmlLangSync locale={locale} />
      {children}
      {/* Lives in the layout so the drawer survives navigation between pages. */}
      <CartDrawer
        locale={locale}
        dict={dict}
        deliveryTetri={getDeliveryFeeTetri()}
      />
    </CartProvider>
  );
}

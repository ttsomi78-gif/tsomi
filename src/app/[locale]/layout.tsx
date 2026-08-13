import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { HtmlLangSync } from "@/components/html-lang-sync";

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

  return (
    <>
      <HtmlLangSync locale={locale} />
      {children}
    </>
  );
}

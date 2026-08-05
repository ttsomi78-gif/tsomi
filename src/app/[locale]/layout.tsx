import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { HtmlLangSync } from "@/components/html-lang-sync";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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

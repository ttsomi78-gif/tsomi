import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Story } from "@/components/story";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildPageMetadata } from "@/lib/seo";
import type { LocaleId } from "@/lib/products";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  return buildPageMetadata("history", locale, "/history");
}

export default async function HistoryPage({
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
        <Story dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

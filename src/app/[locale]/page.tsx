import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Instagram } from "@/components/instagram";
import { Marquee } from "@/components/marquee";
import { Products } from "@/components/products";
import { Story } from "@/components/story";
import { getDictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export const revalidate = 3600;

export default async function Home({
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
        <Hero dict={dict} />
        <Marquee />
        <Products locale={locale} dict={dict} />
        <Story dict={dict} />
        <Instagram dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

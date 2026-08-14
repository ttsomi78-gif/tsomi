import { Benefits } from "@/components/benefits";
import { Community } from "@/components/community";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Instagram } from "@/components/instagram";
// import { Marquee } from "@/components/marquee";
import { Products } from "@/components/products";
import { StoryTeaser } from "@/components/story-teaser";
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
        {/* <Marquee /> */}
        <Benefits dict={dict} />
        <Products locale={locale} dict={dict} />
        <StoryTeaser locale={locale} dict={dict} />
        <Instagram dict={dict} />
        <Community dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

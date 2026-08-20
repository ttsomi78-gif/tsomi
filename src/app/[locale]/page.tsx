import { Benefits } from "@/components/benefits";
import { Community } from "@/components/community";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
// import { Marquee } from "@/components/marquee";
import { Products } from "@/components/products";
import { StoryTeaser } from "@/components/story-teaser";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { company } from "@/lib/company";
import { socialLinks } from "@/lib/social";
import type { LocaleId } from "@/lib/products";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  return buildPageMetadata("home", locale, "");
}

/** Organization + WebSite structured data — feeds Google's knowledge panel. */
function structuredData() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#org`,
        name: company.brand,
        legalName: company.legalName,
        url: siteUrl,
        logo: `${siteUrl}/brand/og.png`,
        telephone: company.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tbilisi",
          addressCountry: "GE",
        },
        sameAs: Object.values(socialLinks),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#site`,
        name: company.brand,
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#org` },
        inLanguage: ["en", "ka", "ru", "ja"],
      },
    ],
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <Header locale={locale} dict={dict} />
      <main>
        <Hero dict={dict} />
        {/* <Marquee /> */}
        <Benefits dict={dict} />
        <Products locale={locale} dict={dict} />
        <StoryTeaser locale={locale} dict={dict} />
        <Community dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

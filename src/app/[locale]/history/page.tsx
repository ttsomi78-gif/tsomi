import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Story } from "@/components/story";
import { getDictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Story — TSOMI",
  description:
    "Why TSOMI is named after dough, the characters behind the prints, and how the brand is made in Batumi, Georgia.",
};

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

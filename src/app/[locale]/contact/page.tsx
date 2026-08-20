import { LegalPage, type LegalContent } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { company } from "@/lib/company";
import { buildPageMetadata } from "@/lib/seo";
import type { LocaleId } from "@/lib/products";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  return buildPageMetadata("contact", locale, "/contact");
}

const content: Record<LocaleId, LegalContent> = {
  en: {
    title: "Contact",
    intro: "Real people, quick answers.",
    updated: `${company.legalName} · ${company.city}`,
    sections: [
      {
        heading: "Phone",
        body: [
          `${company.phone} — calls and messages, Monday to Saturday, 11:00–19:00.`,
        ],
      },
      {
        heading: "Instagram",
        body: [
          `${company.instagram} — DMs are usually the fastest way to reach us.`,
        ],
      },
      {
        heading: "Company",
        body: [
          `The shop is operated by ${company.legalName}, registered in Georgia, based in ${company.city}.`,
        ],
      },
      {
        heading: "Orders",
        body: [
          "Questions about an existing order? Have your order reference ready (it's on the page you saw after payment) and call or message us.",
        ],
      },
    ],
  },
  ka: {
    title: "კონტაქტი",
    intro: "ნამდვილი ადამიანები, სწრაფი პასუხები.",
    updated: `${company.legalNameKa} · ${company.cityKa}`,
    sections: [
      {
        heading: "ტელეფონი",
        body: [
          `${company.phone} — ზარები და შეტყობინებები, ორშაბათი–შაბათი, 11:00–19:00.`,
        ],
      },
      {
        heading: "Instagram",
        body: [
          `${company.instagram} — ყველაზე სწრაფად ჩვეულებრივ აქ გვპოულობენ.`,
        ],
      },
      {
        heading: "კომპანია",
        body: [
          `მაღაზიას მართავს ${company.legalNameKa}, რეგისტრირებული საქართველოში, ${company.cityKa}.`,
        ],
      },
      {
        heading: "შეკვეთები",
        body: [
          "კითხვა არსებულ შეკვეთაზე? მოიმარჯვე შეკვეთის ნომერი (გადახდის შემდეგ გვერდზე წერია) და დაგვირეკე ან მოგვწერე.",
        ],
      },
    ],
  },
  ru: {
    title: "Контакты",
    intro: "Живые люди, быстрые ответы.",
    updated: `${company.legalName} · Тбилиси, Грузия`,
    sections: [
      {
        heading: "Телефон",
        body: [
          `${company.phone} — звонки и сообщения, понедельник–суббота, 11:00–19:00.`,
        ],
      },
      {
        heading: "Instagram",
        body: [
          `${company.instagram} — в директ обычно отвечаем быстрее всего.`,
        ],
      },
      {
        heading: "Компания",
        body: [
          `Магазином управляет ${company.legalName}, зарегистрированная в Грузии, Тбилиси.`,
        ],
      },
      {
        heading: "Заказы",
        body: [
          "Вопрос по существующему заказу? Подготовьте номер заказа (он на странице после оплаты) и позвоните или напишите нам.",
        ],
      },
    ],
  },
  ja: {
    title: "お問い合わせ",
    intro: "実在のスタッフが素早くお答えします。",
    updated: `${company.legalName} · トビリシ、ジョージア`,
    sections: [
      {
        heading: "電話",
        body: [
          `${company.phone} — 通話・メッセージとも、月〜土 11:00–19:00。`,
        ],
      },
      {
        heading: "Instagram",
        body: [
          `${company.instagram} — DMが一番早くつながります。`,
        ],
      },
      {
        heading: "運営会社",
        body: [
          `当店はジョージア・トビリシ登記の${company.legalName}が運営しています。`,
        ],
      },
      {
        heading: "ご注文について",
        body: [
          "既存のご注文に関するお問い合わせは、注文番号（お支払い後のページに表示されています）をご用意のうえ、お電話またはメッセージでご連絡ください。",
        ],
      },
    ],
  },
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return <LegalPage locale={locale} dict={dict} content={content[locale]} />;
}

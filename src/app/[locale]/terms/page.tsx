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
  return buildPageMetadata("terms", locale, "/terms");
}

const content: Record<LocaleId, LegalContent> = {
  en: {
    title: "Terms of Service",
    intro: `The short version: you order, we deliver, and if something's wrong we make it right.`,
    updated: "Last updated: August 2026",
    sections: [
      {
        heading: "Who we are",
        body: [
          `${company.brand} (tsomistreetwear.ge) is operated by ${company.legalName}, registered in Georgia. Contact: ${company.phone}, Instagram ${company.instagram}.`,
        ],
      },
      {
        heading: "Orders and payment",
        body: [
          "All prices are in Georgian lari (₾) and include applicable taxes. The delivery fee is shown at checkout before you pay.",
          "Payments are processed securely by Bank of Georgia. Your card details never reach our servers.",
          "An order is confirmed once payment succeeds. If an item turns out to be unavailable after you've paid, we refund it in full immediately.",
        ],
      },
      {
        heading: "Delivery and returns",
        body: [
          "Delivery terms and our return policy are described on the Delivery & Returns page. In short: delivery across Georgia, and a no-questions return window on unworn items.",
        ],
      },
      {
        heading: "Content",
        body: [
          "All designs, characters, photos and text on this site belong to us. Please don't reproduce them commercially without asking.",
        ],
      },
      {
        heading: "Questions",
        body: [
          `Anything unclear — call ${company.phone} or write to ${company.instagram}. Georgian consumer protection law applies to all purchases.`,
        ],
      },
    ],
  },
  ka: {
    title: "წესები და პირობები",
    intro: "მოკლედ: შენ უკვეთავ, ჩვენ მოგიტანთ, და თუ რამე შეცდომაა — გამოვასწორებთ.",
    updated: "ბოლო განახლება: 2026 წლის აგვისტო",
    sections: [
      {
        heading: "ვინ ვართ",
        body: [
          `${company.brand}-ს (tsomistreetwear.ge) მართავს ${company.legalNameKa}, რეგისტრირებული საქართველოში. კონტაქტი: ${company.phone}, Instagram ${company.instagram}.`,
        ],
      },
      {
        heading: "შეკვეთა და გადახდა",
        body: [
          "ყველა ფასი მოცემულია ლარში (₾) და მოიცავს გადასახადებს. მიწოდების საფასური გადახდამდე ჩანს შეკვეთის გაფორმების გვერდზე.",
          "გადახდებს უსაფრთხოდ ამუშავებს საქართველოს ბანკი. შენი ბარათის მონაცემები ჩვენს სერვერებამდე არასდროს აღწევს.",
          "შეკვეთა დადასტურებულია გადახდის წარმატებით დასრულებისას. თუ გადახდის შემდეგ აღმოჩნდა, რომ ნივთი აღარ არის მარაგში, თანხას დაუყოვნებლივ სრულად დაგიბრუნებთ.",
        ],
      },
      {
        heading: "მიწოდება და დაბრუნება",
        body: [
          "მიწოდებისა და დაბრუნების პირობები აღწერილია შესაბამის გვერდზე. მოკლედ: მიწოდება მთელ საქართველოში და უპრობლემო დაბრუნება უტარებელ ნივთებზე.",
        ],
      },
      {
        heading: "კონტენტი",
        body: [
          "საიტზე განთავსებული ყველა დიზაინი, პერსონაჟი, ფოტო და ტექსტი ჩვენ გვეკუთვნის. გთხოვთ, კომერციულად არ გამოიყენოთ ნებართვის გარეშე.",
        ],
      },
      {
        heading: "კითხვები",
        body: [
          `თუ რამე გაუგებარია — დარეკე ${company.phone} ან მოგვწერე ${company.instagram}. ყველა შენაძენზე ვრცელდება საქართველოს მომხმარებელთა უფლებების დაცვის კანონმდებლობა.`,
        ],
      },
    ],
  },
  ru: {
    title: "Условия использования",
    intro: "Коротко: вы заказываете, мы доставляем, а если что-то не так — мы это исправим.",
    updated: "Последнее обновление: август 2026",
    sections: [
      {
        heading: "Кто мы",
        body: [
          `Магазином ${company.brand} (tsomistreetwear.ge) управляет ${company.legalName}, зарегистрированная в Грузии. Контакты: ${company.phone}, Instagram ${company.instagram}.`,
        ],
      },
      {
        heading: "Заказы и оплата",
        body: [
          "Все цены указаны в грузинских лари (₾) и включают налоги. Стоимость доставки видна при оформлении заказа до оплаты.",
          "Платежи безопасно обрабатывает Банк Грузии. Данные вашей карты никогда не попадают на наши серверы.",
          "Заказ считается подтверждённым после успешной оплаты. Если после оплаты товар окажется недоступен, мы немедленно вернём полную сумму.",
        ],
      },
      {
        heading: "Доставка и возврат",
        body: [
          "Условия доставки и возврата описаны на странице «Доставка и возврат». Коротко: доставка по всей Грузии и лёгкий возврат неношеных вещей.",
        ],
      },
      {
        heading: "Контент",
        body: [
          "Все дизайны, персонажи, фотографии и тексты на сайте принадлежат нам. Пожалуйста, не используйте их в коммерческих целях без разрешения.",
        ],
      },
      {
        heading: "Вопросы",
        body: [
          `Если что-то непонятно — звоните ${company.phone} или пишите в ${company.instagram}. На все покупки распространяется законодательство Грузии о защите прав потребителей.`,
        ],
      },
    ],
  },
  ja: {
    title: "利用規約",
    intro: "要するに：ご注文いただければお届けします。問題があれば、きちんと対応します。",
    updated: "最終更新：2026年8月",
    sections: [
      {
        heading: "運営者について",
        body: [
          `${company.brand}（tsomistreetwear.ge）は、ジョージアで登記された${company.legalName}が運営しています。連絡先：${company.phone}、Instagram ${company.instagram}。`,
        ],
      },
      {
        heading: "注文と支払い",
        body: [
          "価格はすべてジョージア・ラリ（₾）表示で、税込みです。配送料はお支払い前にチェックアウト画面に表示されます。",
          "決済はジョージア銀行が安全に処理します。カード情報が当店のサーバーに届くことはありません。",
          "ご注文は決済完了をもって確定します。決済後に商品が在庫切れと判明した場合は、直ちに全額を返金します。",
        ],
      },
      {
        heading: "配送と返品",
        body: [
          "配送条件と返品ポリシーは「配送と返品」ページをご覧ください。要点：ジョージア全土への配送と、未着用品の返品対応です。",
        ],
      },
      {
        heading: "コンテンツ",
        body: [
          "本サイトのデザイン、キャラクター、写真、テキストはすべて当店に帰属します。許可なく商用利用しないでください。",
        ],
      },
      {
        heading: "お問い合わせ",
        body: [
          `ご不明な点は${company.phone}まで、またはInstagram（${company.instagram}）へどうぞ。すべてのお取引にはジョージアの消費者保護法が適用されます。`,
        ],
      },
    ],
  },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return <LegalPage locale={locale} dict={dict} content={content[locale]} />;
}

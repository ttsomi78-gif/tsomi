import { LegalPage, type LegalContent } from "@/components/legal-page";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { getShippingRates } from "@/lib/settings";
import { deliveryAmountLabel } from "@/lib/delivery-copy";
import { company } from "@/lib/company";
import { buildPageMetadata } from "@/lib/seo";
import type { LocaleId } from "@/lib/products";
import { ZONE_COUNTRIES, countryName, type ShippingRates } from "@/lib/shipping";

// The delivery rates are read from the database at request time.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  return buildPageMetadata("shipping", locale, "/shipping");
}

/** The zone prices as the customer sees them ("10 ₾" or the free word) and the country lists. */
type Labels = {
  ge: string;
  euA: string;
  euB: string;
  us: string;
  cis: string;
  geFree: boolean;
  /** Localized, comma-separated country names of the two EU tiers and the CIS zone. */
  euACountries: string;
  cisCountries: string;
};

const content = ({
  ge,
  euA,
  euB,
  us,
  cis,
  geFree,
  euACountries,
  cisCountries,
}: Labels): Record<LocaleId, LegalContent> => ({
  en: {
    title: "Delivery & Returns",
    intro: "Simple rules, no small print.",
    updated: "Last updated: September 2026",
    sections: [
      {
        heading: "Delivery in Georgia",
        body: [
          geFree
            ? "We deliver across Georgia — delivery is free."
            : `We deliver across Georgia. Delivery is ${ge} per order, added once at checkout.`,
          `Orders are handed to the courier within 1–2 business days and typically arrive in ${company.deliveryDays} business days.`,
          "We'll contact you by phone to confirm the delivery time.",
        ],
      },
      {
        heading: "International delivery",
        body: [
          `European Union — ${euA} per order to ${euACountries}; ${euB} per order to every other EU country. USA — ${us} per order. ${cisCountries} — ${cis} per order. The price appears at checkout as soon as you pick your country.`,
          "Parcels to the EU and USA leave Tbilisi once a week and usually arrive in 2.5–3 weeks.",
          "Please give a postal code and a phone number that works in the destination country — the courier needs both to deliver.",
          "International parcels are insured by the courier for up to 30 €.",
          `Somewhere else? Write to us on Instagram (${company.instagram}) and we'll find a way.`,
        ],
      },
      {
        heading: "Returns",
        body: [
          `You can return any item within ${company.returnDays} days of receiving it — unworn, unwashed, with tags attached.`,
          `To start a return, call us or write to us on Instagram (${company.instagram}). We'll arrange the rest.`,
          "Once we receive the item back, we refund the full item price to your card within 5 business days. Delivery fees are refunded when the return is our fault (wrong or defective item).",
        ],
      },
      {
        heading: "Defective or wrong items",
        body: [
          "If something arrives damaged or isn't what you ordered, we replace it or refund you in full, including delivery — your choice.",
        ],
      },
    ],
  },
  ka: {
    title: "მიწოდება და დაბრუნება",
    intro: "მარტივი წესები, წვრილი შრიფტის გარეშე.",
    updated: "ბოლო განახლება: 2026 წლის სექტემბერი",
    sections: [
      {
        heading: "მიწოდება საქართველოში",
        body: [
          geFree
            ? "მიწოდება მოქმედებს მთელ საქართველოში — უფასოდ."
            : `მიწოდება მოქმედებს მთელ საქართველოში. მიწოდების ფასია ${ge} შეკვეთაზე და გადახდისას ერთხელ ემატება.`,
          `შეკვეთას კურიერს 1–2 სამუშაო დღეში გადავცემთ; ჩაბარებას ჩვეულებრივ ${company.deliveryDays} სამუშაო დღე სჭირდება.`,
          "მიწოდების დროის დასაზუსტებლად ტელეფონით დაგიკავშირდებით.",
        ],
      },
      {
        heading: "საერთაშორისო მიწოდება",
        body: [
          `ევროკავშირი — ${euA} შეკვეთაზე (${euACountries}), ევროკავშირის დანარჩენ ქვეყნებში ${euB} შეკვეთაზე. აშშ — ${us} შეკვეთაზე. ${cisCountries} — ${cis} შეკვეთაზე. ფასი ქვეყნის არჩევისთანავე გამოჩნდება გადახდის გვერდზე.`,
          "ევროკავშირისა და აშშ-ს ამანათები თბილისიდან კვირაში ერთხელ იგზავნება და ჩვეულებრივ 2,5–3 კვირაში ჩადის.",
          "მიუთითეთ საფოსტო ინდექსი და ტელეფონის ნომერი, რომელიც დანიშნულების ქვეყანაში მუშაობს — კურიერს ჩასაბარებლად ორივე სჭირდება.",
          "საერთაშორისო ამანათებს კურიერი 30 ევრომდე აზღვევს.",
          `სხვა ქვეყანაში გჭირდებათ? მოგვწერეთ Instagram-ზე (${company.instagram}) და გზას ვიპოვით.`,
        ],
      },
      {
        heading: "დაბრუნება",
        body: [
          `ნივთის დაბრუნება შეგიძლიათ მიღებიდან ${company.returnDays} დღის განმავლობაში — უტარებელი, გაურეცხავი, ეტიკეტებით.`,
          `დაბრუნების დასაწყებად დაგვირეკეთ ან მოგვწერეთ Instagram-ზე (${company.instagram}). დანარჩენს ჩვენ მოვაგვარებთ.`,
          "ნივთის მიღების შემდეგ თანხას სრულად დაგიბრუნებთ ბარათზე 5 სამუშაო დღეში. მიწოდების საფასური ბრუნდება მაშინ, როცა შეცდომა ჩვენია (არასწორი ან დაზიანებული ნივთი).",
        ],
      },
      {
        heading: "დაზიანებული ან არასწორი ნივთი",
        body: [
          "თუ ნივთი დაზიანებული მოვიდა ან ის არ არის, რაც შეუკვეთეთ — თქვენი არჩევანით ან შევცვლით, ან თანხას სრულად დაგიბრუნებთ, მიწოდების ჩათვლით.",
        ],
      },
    ],
  },
  ru: {
    title: "Доставка и возврат",
    intro: "Простые правила, без мелкого шрифта.",
    updated: "Последнее обновление: сентябрь 2026",
    sections: [
      {
        heading: "Доставка по Грузии",
        body: [
          geFree
            ? "Доставляем по всей Грузии — доставка бесплатная."
            : `Доставляем по всей Грузии. Стоимость доставки — ${ge} за заказ, добавляется один раз при оформлении.`,
          `Передаём заказ курьеру в течение 1–2 рабочих дней; доставка обычно занимает ${company.deliveryDays} рабочих дней.`,
          "Мы позвоним вам, чтобы согласовать время доставки.",
        ],
      },
      {
        heading: "Международная доставка",
        body: [
          `Евросоюз — ${euA} за заказ (${euACountries}), в остальные страны ЕС ${euB} за заказ. США — ${us} за заказ. ${cisCountries} — ${cis} за заказ. Цена появится при оформлении, как только вы выберете страну.`,
          "Посылки в ЕС и США уходят из Тбилиси раз в неделю и обычно доходят за 2,5–3 недели.",
          "Укажите почтовый индекс и номер телефона, который работает в стране назначения, — курьеру нужны оба.",
          "Международные посылки застрахованы курьером на сумму до 30 €.",
          `Нужна другая страна? Напишите нам в Instagram (${company.instagram}) — что-нибудь придумаем.`,
        ],
      },
      {
        heading: "Возврат",
        body: [
          `Вернуть товар можно в течение ${company.returnDays} дней с момента получения — неношеный, нестираный, с бирками.`,
          `Чтобы оформить возврат, позвоните нам или напишите в Instagram (${company.instagram}). Остальное мы возьмём на себя.`,
          "После получения товара мы вернём полную стоимость на вашу карту в течение 5 рабочих дней. Стоимость доставки возвращается, если ошибка наша (не тот или бракованный товар).",
        ],
      },
      {
        heading: "Брак или не тот товар",
        body: [
          "Если товар пришёл повреждённым или это не то, что вы заказывали, — заменим или полностью вернём деньги, включая доставку. На ваш выбор.",
        ],
      },
    ],
  },
  ja: {
    title: "配送と返品",
    intro: "シンプルなルール。小さな文字の注意書きはありません。",
    updated: "最終更新：2026年9月",
    sections: [
      {
        heading: "ジョージア国内配送",
        body: [
          geFree
            ? "ジョージア全土に配送します。配送料は無料です。"
            : `ジョージア全土に配送します。配送料は1注文あたり${ge}で、ご注文時に一度だけ加算されます。`,
          `ご注文は1〜2営業日以内に配送業者へ引き渡され、通常${company.deliveryDays}営業日でお届けします。`,
          "お届け時間の確認のため、お電話でご連絡いたします。",
        ],
      },
      {
        heading: "海外配送",
        body: [
          `EU — ${euACountries}へは1注文あたり${euA}、その他のEU加盟国へは1注文あたり${euB}。アメリカ — 1注文あたり${us}。${cisCountries} — 1注文あたり${cis}。国を選ぶと、ご注文画面に送料が表示されます。`,
          "EU・アメリカ向けの荷物はトビリシから週1回発送され、通常2.5〜3週間で到着します。",
          "郵便番号と、配送先の国で使える電話番号をご記入ください。配送業者のお届けに両方が必要です。",
          "海外向けの荷物は配送業者により最大30€まで保険が掛けられます。",
          `その他の国への配送は、Instagram（${company.instagram}）でご相談ください。`,
        ],
      },
      {
        heading: "返品",
        body: [
          `商品到着から${company.returnDays}日以内であれば返品できます — 未着用・未洗濯・タグ付きの状態に限ります。`,
          `返品をご希望の場合は、お電話またはInstagram（${company.instagram}）でご連絡ください。あとはこちらで手配します。`,
          "商品の返送を確認後、5営業日以内にカードへ全額を返金します。当店側の誤り（誤送・不良品）の場合は配送料も返金します。",
        ],
      },
      {
        heading: "不良品・誤送について",
        body: [
          "商品が破損していた場合や注文と異なる場合は、交換または配送料を含む全額返金のどちらかをお選びいただけます。",
        ],
      },
    ],
  },
});

function labels(rates: ShippingRates, dict: Dictionary, locale: LocaleId): Labels {
  const names = (codes: readonly string[]) =>
    codes.map((code) => countryName(code, locale)).join(", ");
  return {
    ge: deliveryAmountLabel(rates.georgia, dict),
    euA: deliveryAmountLabel(rates.euA, dict),
    euB: deliveryAmountLabel(rates.euB, dict),
    us: deliveryAmountLabel(rates.us, dict),
    cis: deliveryAmountLabel(rates.cis, dict),
    geFree: rates.georgia === 0,
    euACountries: names(ZONE_COUNTRIES.euA),
    cisCountries: names(ZONE_COUNTRIES.cis),
  };
}

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  const [dict, rates] = await Promise.all([getDictionary(locale), getShippingRates()]);
  return (
    <LegalPage
      locale={locale}
      dict={dict}
      content={content(labels(rates, dict, locale))[locale]}
    />
  );
}

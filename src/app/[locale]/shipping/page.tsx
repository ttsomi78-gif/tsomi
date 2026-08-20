import { LegalPage, type LegalContent } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { getDeliveryFeeTetri } from "@/lib/orders";
import { formatGel, tetriToGel } from "@/lib/money";
import { company } from "@/lib/company";
import { buildPageMetadata } from "@/lib/seo";
import type { LocaleId } from "@/lib/products";

// The delivery fee is read from the environment at request time.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  return buildPageMetadata("shipping", locale, "/shipping");
}

const content = (fee: string): Record<LocaleId, LegalContent> => ({
  en: {
    title: "Delivery & Returns",
    intro: "Simple rules, no small print.",
    updated: "Last updated: August 2026",
    sections: [
      {
        heading: "Delivery",
        body: [
          `We deliver across Georgia. The flat delivery fee is ${fee} ₾, added once per order at checkout.`,
          `Orders are handed to the courier within 1–2 business days and typically arrive in ${company.deliveryDays} business days.`,
          "We'll contact you by phone to confirm the delivery time.",
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
    updated: "ბოლო განახლება: 2026 წლის აგვისტო",
    sections: [
      {
        heading: "მიწოდება",
        body: [
          `მიწოდება მოქმედებს მთელ საქართველოში. მიწოდების ფასია ${fee} ₾ — ერთხელ ემატება შეკვეთას გადახდისას.`,
          `შეკვეთას კურიერს გადავცემთ 1–2 სამუშაო დღეში; ჩაბარებას ჩვეულებრივ ${company.deliveryDays} სამუშაო დღე სჭირდება.`,
          "მიწოდების დროის დასაზუსტებლად ტელეფონით დაგიკავშირდებით.",
        ],
      },
      {
        heading: "დაბრუნება",
        body: [
          `ნივთის დაბრუნება შეგიძლია მიღებიდან ${company.returnDays} დღის განმავლობაში — უტარებელი, გაურეცხავი, ეტიკეტებით.`,
          `დაბრუნების დასაწყებად დაგვირეკე ან მოგვწერე Instagram-ზე (${company.instagram}). დანარჩენს ჩვენ მოვაგვარებთ.`,
          "ნივთის მიღების შემდეგ თანხას სრულად დაგიბრუნებთ ბარათზე 5 სამუშაო დღეში. მიწოდების საფასური ბრუნდება მაშინ, როცა შეცდომა ჩვენია (არასწორი ან დაზიანებული ნივთი).",
        ],
      },
      {
        heading: "დაზიანებული ან არასწორი ნივთი",
        body: [
          "თუ ნივთი დაზიანებული მოვიდა ან ის არ არის, რაც შეუკვეთე — შენი არჩევანით ან შევცვლით, ან თანხას სრულად დაგიბრუნებთ, მიწოდების ჩათვლით.",
        ],
      },
    ],
  },
  ru: {
    title: "Доставка и возврат",
    intro: "Простые правила, без мелкого шрифта.",
    updated: "Последнее обновление: август 2026",
    sections: [
      {
        heading: "Доставка",
        body: [
          `Доставляем по всей Грузии. Стоимость доставки — ${fee} ₾, добавляется один раз к заказу при оформлении.`,
          `Передаём заказ курьеру в течение 1–2 рабочих дней; доставка обычно занимает ${company.deliveryDays} рабочих дней.`,
          "Мы позвоним вам, чтобы согласовать время доставки.",
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
    updated: "最終更新：2026年8月",
    sections: [
      {
        heading: "配送",
        body: [
          `ジョージア全土に配送します。配送料は一律${fee} ₾で、ご注文時に一度だけ加算されます。`,
          `ご注文は1〜2営業日以内に配送業者へ引き渡され、通常${company.deliveryDays}営業日でお届けします。`,
          "お届け時間の確認のため、お電話でご連絡いたします。",
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

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const fee = formatGel(tetriToGel(getDeliveryFeeTetri()));
  return <LegalPage locale={locale} dict={dict} content={content(fee)[locale]} />;
}

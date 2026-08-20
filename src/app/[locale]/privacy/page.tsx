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
  return buildPageMetadata("privacy", locale, "/privacy");
}

const content: Record<LocaleId, LegalContent> = {
  en: {
    title: "Privacy Policy",
    intro: "We collect the minimum needed to deliver your order — and nothing else.",
    updated: "Last updated: August 2026",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you place an order: your name, phone number, email, and delivery address. That's the full list.",
          "We don't run ad trackers and we don't use analytics cookies. The only cookies are the essential ones that keep the site working (your language choice and, for staff, the admin login).",
          "Your cart is stored in your own browser, not on our servers.",
        ],
      },
      {
        heading: "What we use it for",
        body: [
          "Delivering your order and contacting you about it. Nothing else — no marketing lists, no newsletters you didn't ask for.",
        ],
      },
      {
        heading: "Payments",
        body: [
          "Card payments are handled entirely by Bank of Georgia on their secure page. We never see or store your card number.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "The courier gets your name, phone and address — that's how the package finds you. The bank processes your payment. We don't sell or share your data with anyone else.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `Want your data deleted or corrected? Call ${company.phone} or write to ${company.instagram} and we'll do it. We keep order records only as long as accounting law requires.`,
        ],
      },
    ],
  },
  ka: {
    title: "კონფიდენციალურობის პოლიტიკა",
    intro: "ვაგროვებთ მხოლოდ იმას, რაც შეკვეთის მოსატანად გვჭირდება — მეტს არაფერს.",
    updated: "ბოლო განახლება: 2026 წლის აგვისტო",
    sections: [
      {
        heading: "რას ვაგროვებთ",
        body: [
          "შეკვეთისას: სახელი, ტელეფონი, ელ. ფოსტა და მიწოდების მისამართი. ეს არის სრული სია.",
          "სარეკლამო თრექერები არ გვაქვს და ანალიტიკის cookie-ებს არ ვიყენებთ. მხოლოდ აუცილებელი cookie-ებია — ენის არჩევანი და, თანამშრომლებისთვის, ადმინის ავტორიზაცია.",
          "შენი კალათა შენს ბრაუზერში ინახება და არა ჩვენს სერვერებზე.",
        ],
      },
      {
        heading: "რისთვის ვიყენებთ",
        body: [
          "შეკვეთის მიწოდებისთვის და შეკვეთასთან დაკავშირებით დასაკავშირებლად. სხვა არაფრისთვის — არც სარეკლამო სიები, არც გამოუწერელი ნიუსლეთერები.",
        ],
      },
      {
        heading: "გადახდები",
        body: [
          "ბარათით გადახდას მთლიანად საქართველოს ბანკი ამუშავებს საკუთარ დაცულ გვერდზე. შენი ბარათის ნომერს ვერასდროს ვხედავთ და არ ვინახავთ.",
        ],
      },
      {
        heading: "ვის ვუზიარებთ",
        body: [
          "კურიერი იღებს სახელს, ტელეფონსა და მისამართს — ასე გპოულობს ამანათი. ბანკი ამუშავებს გადახდას. შენს მონაცემებს არავის ვყიდით და არ გადავცემთ.",
        ],
      },
      {
        heading: "შენი უფლებები",
        body: [
          `გინდა მონაცემების წაშლა ან შესწორება? დარეკე ${company.phone} ან მოგვწერე ${company.instagram} და გავაკეთებთ. შეკვეთის ჩანაწერებს ვინახავთ მხოლოდ იმდენ ხანს, რამდენსაც საბუღალტრო კანონმდებლობა მოითხოვს.`,
        ],
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    intro: "Мы собираем минимум, необходимый для доставки заказа, — и ничего больше.",
    updated: "Последнее обновление: август 2026",
    sections: [
      {
        heading: "Что мы собираем",
        body: [
          "При оформлении заказа: имя, телефон, эл. почту и адрес доставки. Это весь список.",
          "У нас нет рекламных трекеров и аналитических cookie. Только необходимые: выбор языка и — для сотрудников — вход в админ-панель.",
          "Ваша корзина хранится в вашем браузере, а не на наших серверах.",
        ],
      },
      {
        heading: "Для чего мы это используем",
        body: [
          "Для доставки заказа и связи по его поводу. Больше ни для чего — никаких рассылок, на которые вы не подписывались.",
        ],
      },
      {
        heading: "Платежи",
        body: [
          "Оплату картой полностью обрабатывает Банк Грузии на своей защищённой странице. Мы никогда не видим и не храним номер вашей карты.",
        ],
      },
      {
        heading: "Кому мы передаём данные",
        body: [
          "Курьер получает имя, телефон и адрес — так посылка находит вас. Банк обрабатывает платёж. Мы не продаём и не передаём ваши данные никому другому.",
        ],
      },
      {
        heading: "Ваши права",
        body: [
          `Хотите удалить или исправить свои данные? Позвоните ${company.phone} или напишите в ${company.instagram} — мы это сделаем. Записи о заказах храним только столько, сколько требует бухгалтерское законодательство.`,
        ],
      },
    ],
  },
  ja: {
    title: "プライバシーポリシー",
    intro: "ご注文のお届けに必要な最小限の情報だけを収集します。それ以外は何も。",
    updated: "最終更新：2026年8月",
    sections: [
      {
        heading: "収集する情報",
        body: [
          "ご注文時：お名前、電話番号、メールアドレス、お届け先住所。これがすべてです。",
          "広告トラッカーや分析用Cookieは使用していません。サイトの動作に必須のCookie（言語設定と、スタッフ用の管理画面ログイン）のみです。",
          "カートの中身はお客様のブラウザに保存され、当店のサーバーには保存されません。",
        ],
      },
      {
        heading: "利用目的",
        body: [
          "ご注文のお届けと、それに関するご連絡のためだけに使用します。マーケティングリストや、頼んでいないメールマガジンには使いません。",
        ],
      },
      {
        heading: "決済について",
        body: [
          "カード決済はジョージア銀行の安全なページで完結します。カード番号を当店が見ることも保存することもありません。",
        ],
      },
      {
        heading: "第三者への提供",
        body: [
          "配送業者にはお名前・電話番号・住所を渡します（お荷物を届けるためです）。銀行は決済を処理します。それ以外の第三者にデータを販売・提供することはありません。",
        ],
      },
      {
        heading: "お客様の権利",
        body: [
          `データの削除・訂正をご希望の場合は、${company.phone}またはInstagram（${company.instagram}）までご連絡ください。注文記録は会計法令が求める期間のみ保管します。`,
        ],
      },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return <LegalPage locale={locale} dict={dict} content={content[locale]} />;
}

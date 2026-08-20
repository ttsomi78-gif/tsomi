import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import { locales, type LocaleId } from "@/lib/products";

/**
 * Localized titles and descriptions for every indexable page, plus the
 * canonical/hreflang wiring Google needs to serve the right language.
 *
 * Titles are written WITHOUT the brand suffix — the root layout's title
 * template appends " — TSOMI" so it stays consistent site-wide.
 */

type PageMeta = { title: string; description: string };

const OG_LOCALE: Record<LocaleId, string> = {
  en: "en_US",
  ka: "ka_GE",
  ru: "ru_RU",
  ja: "ja_JP",
};

export const pageMeta: Record<string, Record<LocaleId, PageMeta>> = {
  home: {
    en: {
      title: "TSOMI — ცომი · Georgian streetwear, made of dough",
      description:
        "Khinkali tees and khachapuri shopper bags, designed and made in Georgia. TSOMI (ცომი) means dough — we wear it daily. Delivery across Georgia.",
    },
    ka: {
      title: "TSOMI — ცომი · ქართული სტრიტვეარი ცომისგან",
      description:
        "ხინკლის მაისურები და ხაჭაპურის შოპერები — შექმნილი და დამზადებული საქართველოში. TSOMI ნიშნავს ცომს. მიწოდება მთელ საქართველოში.",
    },
    ru: {
      title: "TSOMI — ცომი · Грузинский стритвир из теста",
      description:
        "Футболки с хинкали и шоперы с хачапури — придуманы и сшиты в Грузии. TSOMI (цоми) значит «тесто». Доставка по всей Грузии.",
    },
    ja: {
      title: "TSOMI — ცომი · 生地から生まれたジョージアのストリートウェア",
      description:
        "ヒンカリTシャツとハチャプリのトートバッグ。デザインも製造もジョージア。TSOMI（ツォミ）は「生地」という意味。ジョージア全土に配送。",
    },
  },
  catalog: {
    en: {
      title: "Catalog",
      description:
        "The full TSOMI drop — khinkali tees, khachapuri shopper bags and more Georgian streetwear. Prices in GEL, delivery across Georgia.",
    },
    ka: {
      title: "კატალოგი",
      description:
        "TSOMI-ს სრული კოლექცია — ხინკლის მაისურები, ხაჭაპურის შოპერები და სხვა ქართული სტრიტვეარი. ფასები ლარში, მიწოდება მთელ საქართველოში.",
    },
    ru: {
      title: "Каталог",
      description:
        "Вся коллекция TSOMI — футболки с хинкали, шоперы с хачапури и другой грузинский стритвир. Цены в лари, доставка по всей Грузии.",
    },
    ja: {
      title: "カタログ",
      description:
        "TSOMIの全コレクション — ヒンカリTシャツ、ハチャプリのトートバッグなど。価格はラリ表示、ジョージア全土に配送。",
    },
  },
  history: {
    en: {
      title: "Our Story",
      description:
        "Why TSOMI is named after dough, the khinkali and khachapuri characters behind the prints, and how the brand is made in Georgia.",
    },
    ka: {
      title: "ჩვენი ისტორია",
      description:
        "რატომ ჰქვია TSOMI-ს ცომი, ვინ არიან ხინკლისა და ხაჭაპურის პერსონაჟები პრინტებზე და როგორ იქმნება ბრენდი საქართველოში.",
    },
    ru: {
      title: "Наша история",
      description:
        "Почему TSOMI назван в честь теста, кто такие персонажи-хинкали и хачапури на принтах и как бренд создаётся в Грузии.",
    },
    ja: {
      title: "ブランドストーリー",
      description:
        "TSOMIが「生地」と名付けられた理由、プリントに描かれたヒンカリとハチャプリのキャラクター、ジョージアでのものづくり。",
    },
  },
  shipping: {
    en: {
      title: "Delivery & Returns",
      description:
        "Flat-fee delivery across Georgia in 2–5 business days, and 14-day returns on unworn items. Simple rules, no small print.",
    },
    ka: {
      title: "მიწოდება და დაბრუნება",
      description:
        "მიწოდება მთელ საქართველოში 2–5 სამუშაო დღეში და 14-დღიანი დაბრუნება უტარებელ ნივთებზე. მარტივი წესები.",
    },
    ru: {
      title: "Доставка и возврат",
      description:
        "Доставка по всей Грузии за 2–5 рабочих дней и возврат в течение 14 дней для неношеных вещей. Простые правила.",
    },
    ja: {
      title: "配送と返品",
      description:
        "ジョージア全土へ2〜5営業日でお届け。未着用品は14日以内返品可能。シンプルなルール。",
    },
  },
  terms: {
    en: {
      title: "Terms of Service",
      description:
        "Ordering, payment and delivery terms for the TSOMI shop. Payments processed securely by Bank of Georgia.",
    },
    ka: {
      title: "წესები და პირობები",
      description:
        "შეკვეთის, გადახდისა და მიწოდების პირობები TSOMI-ს მაღაზიაში. გადახდებს უსაფრთხოდ ამუშავებს საქართველოს ბანკი.",
    },
    ru: {
      title: "Условия использования",
      description:
        "Условия заказа, оплаты и доставки магазина TSOMI. Платежи безопасно обрабатывает Банк Грузии.",
    },
    ja: {
      title: "利用規約",
      description:
        "TSOMIショップのご注文・お支払い・配送条件。決済はジョージア銀行が安全に処理します。",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      description:
        "What TSOMI collects (only what's needed to deliver your order), how it's used, and your rights. No trackers, no ad cookies.",
    },
    ka: {
      title: "კონფიდენციალურობის პოლიტიკა",
      description:
        "რას აგროვებს TSOMI (მხოლოდ შეკვეთის მიწოდებისთვის საჭიროს), როგორ იყენებს და რა უფლებები გაქვს. თრექერების გარეშე.",
    },
    ru: {
      title: "Политика конфиденциальности",
      description:
        "Что собирает TSOMI (только необходимое для доставки заказа), как это используется и ваши права. Без трекеров и рекламных cookie.",
    },
    ja: {
      title: "プライバシーポリシー",
      description:
        "TSOMIが収集する情報（注文のお届けに必要な最小限のみ）とその利用目的、お客様の権利について。トラッカーなし。",
    },
  },
  contact: {
    en: {
      title: "Contact",
      description:
        "Reach TSOMI by phone or Instagram — Turkun Studio LLC, Tbilisi, Georgia. Mon–Sat, 11:00–19:00.",
    },
    ka: {
      title: "კონტაქტი",
      description:
        "დაუკავშირდი TSOMI-ს ტელეფონით ან Instagram-ით — შპს ტურკუნ სტუდიო, თბილისი. ორშაბათი–შაბათი, 11:00–19:00.",
    },
    ru: {
      title: "Контакты",
      description:
        "Связаться с TSOMI по телефону или в Instagram — Turkun Studio LLC, Тбилиси, Грузия. Пн–сб, 11:00–19:00.",
    },
    ja: {
      title: "お問い合わせ",
      description:
        "TSOMIへのお問い合わせは電話またはInstagramで。Turkun Studio LLC、トビリシ。月〜土 11:00–19:00。",
    },
  },
};

/**
 * Metadata for one localized public page: title, description, canonical URL,
 * hreflang alternates for every locale (x-default → en), and OpenGraph.
 *
 * `path` is the locale-relative path, e.g. "" for home or "/catalog".
 */
export function buildPageMetadata(
  page: keyof typeof pageMeta,
  locale: LocaleId,
  path: string,
): Metadata {
  const meta = pageMeta[page][locale];
  const siteUrl = getSiteUrl();

  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
  );
  languages["x-default"] = `${siteUrl}/en${path}`;

  return {
    // The home title already carries the brand; `absolute` opts it out of the
    // root template so it doesn't become "TSOMI — ... — TSOMI".
    title: page === "home" ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: {
      canonical: `${siteUrl}/${locale}${path}`,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "TSOMI",
      title: meta.title,
      description: meta.description,
      url: `${siteUrl}/${locale}${path}`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "TSOMI — ცომი" }],
    },
  };
}

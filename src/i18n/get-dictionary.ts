import type { LocaleId } from "@/lib/products";
import en from "./dictionaries/en";

export interface Dictionary {
  nav: {
    home: string;
    catalog: string;
    story: string;
    instagram: string;
    shop: string;
    menu: string;
  };
  hero: {
    line1: string;
    line2: string;
    highlight: string;
    and: string;
    khinkali: string;
    sub: string;
    cta: string;
    ctaSecondary: string;
    instagramHandle: string;
  };
  benefits: { title: string; text: string }[];
  products: {
    heading: string;
    viewCatalog: string;
  };
  story: {
    eyebrow: string;
    headingSuffix: string;
    paragraph: string;
    readMore: string;
    castEyebrow: string;
    castIntro: string;
    characters: { trait: string; title: string; text: string }[];
    gallery: {
      prev: string;
      next: string;
      look: string;
      artEyebrow: string;
      artHeading: string;
      artIntro: string;
    };
    madeIn: { eyebrow: string; heading: string; text: string };
    manifesto: { heading: string; items: string[]; closing: string };
  };
  instagram: {
    heading: string;
  };
  community: {
    heading: string;
    text: string;
    cta: string;
  };
  footer: {
    shop: string;
    catalog: string;
    story: string;
    social: string;
    copyright: string;
    tagline: string;
    info: string;
    terms: string;
    privacy: string;
    shipping: string;
    contact: string;
  };
  catalog: {
    heading: string;
    filterAll: string;
    empty: string;
    itemCount: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortName: string;
    inStockOnly: string;
  };
  product: {
    soldOut: string;
    lowStock: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyCta: string;
    add: string;
    added: string;
    remove: string;
    subtotal: string;
    delivery: string;
    total: string;
    checkout: string;
    continueShopping: string;
    close: string;
    open: string;
    decrease: string;
    increase: string;
    maxStock: string;
  };
  checkout: {
    heading: string;
    summary: string;
    contactHeading: string;
    shippingHeading: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    note: string;
    notePlaceholder: string;
    pay: string;
    paying: string;
    backToCart: string;
    emptyCart: string;
    deliveryNote: string;
    securedBy: string;
    required: string;
    errorEmpty: string;
    errorUnavailable: string;
    errorSoldOut: string;
    errorStock: string;
    errorPayment: string;
  };
  order: {
    paidHeading: string;
    paidText: string;
    failedHeading: string;
    failedText: string;
    pendingHeading: string;
    pendingText: string;
    expiredHeading: string;
    expiredText: string;
    reference: string;
    items: string;
    delivery: string;
    total: string;
    shippingTo: string;
    tryAgain: string;
    backToShop: string;
    refresh: string;
  };
  language: {
    label: string;
  };
}

const loaders: Record<LocaleId, () => Promise<{ default: Dictionary }>> = {
  en: () => Promise.resolve({ default: en }),
  ru: () => import("./dictionaries/ru"),
  ka: () => import("./dictionaries/ka"),
  ja: () => import("./dictionaries/ja"),
};

export async function getDictionary(locale: LocaleId): Promise<Dictionary> {
  const loader = loaders[locale] ?? loaders.en;
  const mod = await loader();
  return mod.default;
}

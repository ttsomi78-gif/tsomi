import type { LocaleId } from "@/lib/products";
import en from "./dictionaries/en";

export interface Dictionary {
  nav: {
    catalog: string;
    story: string;
    instagram: string;
    cart: string;
  };
  hero: {
    line1: string;
    line2: string;
    highlight: string;
    and: string;
    khinkali: string;
    cta: string;
    instagramHandle: string;
  };
  products: {
    heading: string;
    viewCatalog: string;
  };
  story: {
    eyebrow: string;
    headingSuffix: string;
    paragraph: string;
    castEyebrow: string;
    characters: { title: string; text: string }[];
  };
  instagram: {
    heading: string;
  };
  footer: {
    shop: string;
    catalog: string;
    story: string;
    social: string;
    copyright: string;
    tagline: string;
  };
  catalog: {
    heading: string;
    filterAll: string;
    empty: string;
    itemCount: string;
  };
  product: {
    soldOut: string;
    lowStock: string;
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

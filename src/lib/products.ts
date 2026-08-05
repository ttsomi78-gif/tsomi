export type CategoryId = "tees" | "bags";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "tees", label: "Tees" },
  { id: "bags", label: "Bags" },
];

export const locales = ["en", "ru", "ka", "ja"] as const;
export type LocaleId = (typeof locales)[number];

export const localeLabels: Record<LocaleId, string> = {
  en: "English",
  ru: "Russian",
  ka: "Georgian",
  ja: "Japanese",
};

/** Per-language copy for one product field. English is the only field that's ever required. */
export type LocalizedText = Record<LocaleId, string | null | undefined>;

/** Falls back to English whenever a language's value is blank. */
export function resolveLocalized(value: LocalizedText, locale: LocaleId = "en"): string {
  return value[locale]?.trim() || value.en?.trim() || "";
}

export type Product = {
  id: string;
  name: string;
  georgian: string;
  price: number; // GEL (₾)
  category: CategoryId;
  image: string;
  /** optional second shot, shown on hover */
  hoverImage?: string;
  alt: string;
  tag?: string;
  /** units currently available to sell */
  stock: number;
};

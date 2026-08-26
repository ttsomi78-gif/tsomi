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

/** One sellable combination — a color and/or size with its own stock. */
export type ProductVariant = {
  id: string;
  /** e.g. "Black". Null when the product has no color dimension. */
  colorName: string | null;
  /** Swatch fill, e.g. "#27211a". */
  colorHex: string | null;
  /** e.g. "M". Null for one-size items. */
  size: string | null;
  stock: number;
};

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
  /** units currently available to sell — the variant total when variants exist */
  stock: number;
  /** Empty array = no variants: flat stock, no picker. */
  variants: ProductVariant[];
};

/** Distinct colors of a product's variants, in display order. */
export function productColors(
  variants: ProductVariant[],
): { colorName: string; colorHex: string | null }[] {
  const seen = new Map<string, string | null>();
  for (const variant of variants) {
    if (variant.colorName && !seen.has(variant.colorName)) {
      seen.set(variant.colorName, variant.colorHex);
    }
  }
  return [...seen].map(([colorName, colorHex]) => ({ colorName, colorHex }));
}

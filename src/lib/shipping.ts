import type { LocaleId } from "@/lib/products";

/**
 * Delivery zones. The courier prices Europe and the USA per kilogram plus a
 * fixed door-delivery surcharge, and a typical order (1–3 tees) stays under
 * one kilogram — so per order the price is effectively flat per zone.
 *
 * Amounts are integer tetri like every other price. The live rates are
 * stored in the `settings` table (editable from the admin); these defaults
 * apply until the admin saves anything.
 */
export type ShippingZone = "georgia" | "eu" | "us";
export type ShippingRates = Record<ShippingZone, number>;

export const DEFAULT_SHIPPING_RATES: ShippingRates = {
  georgia: 1000, // 10 ₾
  eu: 9000, // ≈ 28 € courier cost (7.5–8 €/kg + 20 € door delivery)
  us: 13000, // ≈ 40 € courier cost (15 €/kg + 25 € door delivery)
};

export const SHIPPING_ZONES: ShippingZone[] = ["georgia", "eu", "us"];

/** ISO 3166-1 alpha-2 codes of the 27 EU member states. */
export const EU_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
] as const;

export const SHIPPABLE_COUNTRIES = ["GE", "US", ...EU_COUNTRIES] as const;
export type CountryCode = (typeof SHIPPABLE_COUNTRIES)[number];

/** The "somewhere else" option — selectable so the form can explain, never orderable. */
export const OTHER_COUNTRY = "OTHER";

export function isShippableCountry(value: string): value is CountryCode {
  return (SHIPPABLE_COUNTRIES as readonly string[]).includes(value);
}

export function zoneForCountry(code: string): ShippingZone | null {
  if (code === "GE") return "georgia";
  if (code === "US") return "us";
  if ((EU_COUNTRIES as readonly string[]).includes(code)) return "eu";
  return null;
}

/** Per-order delivery in tetri, or null when we don't ship there. */
export function deliveryFeeTetri(code: string, rates: ShippingRates): number | null {
  const zone = zoneForCountry(code);
  return zone ? rates[zone] : null;
}

const DISPLAY_LOCALE: Record<LocaleId, string> = {
  en: "en",
  ka: "ka",
  ru: "ru",
  ja: "ja",
};

/** Localized country name via ICU; falls back to the code if ICU lacks it. */
export function countryName(code: string, locale: LocaleId): string {
  try {
    const names = new Intl.DisplayNames([DISPLAY_LOCALE[locale]], {
      type: "region",
      fallback: "code",
    });
    return names.of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * Options for the checkout country picker: Georgia first (the default and the
 * home market), the USA next, then the EU alphabetically in the page language.
 */
export function shippableCountryOptions(
  locale: LocaleId,
): { code: CountryCode; name: string }[] {
  const eu = EU_COUNTRIES.map((code) => ({ code, name: countryName(code, locale) })).sort(
    (a, b) => a.name.localeCompare(b.name, DISPLAY_LOCALE[locale]),
  );
  return [
    { code: "GE", name: countryName("GE", locale) },
    { code: "US", name: countryName("US", locale) },
    ...eu,
  ];
}

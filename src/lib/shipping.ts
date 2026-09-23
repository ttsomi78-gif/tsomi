import type { LocaleId } from "@/lib/products";

/**
 * Delivery zones, straight from the courier's price list. Europe and the USA
 * are priced per kilogram plus a fixed door-delivery surcharge, and a typical
 * order (1–3 tees) stays under one kilogram — so per order the price is
 * effectively flat per zone. Only countries on that list can be ordered to.
 *
 * Amounts are integer tetri like every other price. The live rates are
 * stored in the `settings` table (editable from the admin); these defaults
 * apply until the admin saves anything.
 */
export type ShippingZone = "georgia" | "euA" | "euB" | "us" | "cis";
export type ShippingRates = Record<ShippingZone, number>;

export const SHIPPING_ZONES: ShippingZone[] = ["georgia", "euA", "euB", "us", "cis"];

export const DEFAULT_SHIPPING_RATES: ShippingRates = {
  georgia: 1000, // 10 ₾
  euA: 8500, // ≈ 27.5 € (7.5 €/kg + 20 € door delivery)
  euB: 9000, // ≈ 28 € (8 €/kg + 20 € door delivery)
  us: 13000, // ≈ 40 € (15 €/kg + 25 € door delivery)
  cis: 4000, // 40 ₾, the owner's figure
};

/** ISO 3166-1 alpha-2 codes per zone. Georgia is its own zone. */
export const ZONE_COUNTRIES: Record<Exclude<ShippingZone, "georgia">, readonly string[]> = {
  // The courier's 7.5 €/kg tier.
  euA: ["ES", "DE", "FR", "IT", "PL", "BG", "GR", "CY"],
  // Every other EU member: 8 €/kg.
  euB: [
    "AT", "BE", "HR", "CZ", "DK", "EE", "FI", "HU", "IE", "LV", "LT", "LU", "MT",
    "NL", "PT", "RO", "SK", "SI", "SE",
  ],
  us: ["US"],
  cis: ["RU", "KZ", "KG"],
};

export const SHIPPABLE_COUNTRIES: readonly string[] = [
  "GE",
  ...ZONE_COUNTRIES.euA,
  ...ZONE_COUNTRIES.euB,
  ...ZONE_COUNTRIES.us,
  ...ZONE_COUNTRIES.cis,
];

/** The "somewhere else" option — selectable so the form can explain, never orderable. */
export const OTHER_COUNTRY = "OTHER";

export function isShippableCountry(value: string): boolean {
  return SHIPPABLE_COUNTRIES.includes(value);
}

export function zoneForCountry(code: string): ShippingZone | null {
  if (code === "GE") return "georgia";
  for (const zone of ["euA", "euB", "us", "cis"] as const) {
    if (ZONE_COUNTRIES[zone].includes(code)) return zone;
  }
  return null;
}

/** Per-order delivery in tetri, or null when we don't ship there. */
export function deliveryFeeTetri(code: string, rates: ShippingRates): number | null {
  const zone = zoneForCountry(code);
  return zone ? rates[zone] : null;
}

/** Cheapest international rate — for "delivery abroad from X" lines. */
export function cheapestAbroadTetri(rates: ShippingRates): number {
  return Math.min(rates.euA, rates.euB, rates.us, rates.cis);
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
 * home market), then everywhere else alphabetically in the page language.
 */
export function shippableCountryOptions(
  locale: LocaleId,
): { code: string; name: string }[] {
  const abroad = SHIPPABLE_COUNTRIES.filter((code) => code !== "GE")
    .map((code) => ({ code, name: countryName(code, locale) }))
    .sort((a, b) => a.name.localeCompare(b.name, DISPLAY_LOCALE[locale]));
  return [{ code: "GE", name: countryName("GE", locale) }, ...abroad];
}

import { formatGel, tetriToGel } from "@/lib/money";
import { cheapestAbroadTetri, type ShippingRates } from "@/lib/shipping";
import type { Dictionary } from "@/i18n/get-dictionary";

/** "10 ₾", or the localized "free" when a zone costs nothing. */
export function deliveryAmountLabel(tetri: number, dict: Dictionary): string {
  return tetri > 0 ? `${formatGel(tetriToGel(tetri))} ₾` : dict.checkout.deliveryFree;
}

/** "Delivery: Georgia 10 ₾ · abroad from 40 ₾" — product page and cart. */
export function deliveryZonesLine(rates: ShippingRates, dict: Dictionary): string {
  return dict.checkout.deliveryZones
    .replace("{ge}", deliveryAmountLabel(rates.georgia, dict))
    .replace("{min}", deliveryAmountLabel(cheapestAbroadTetri(rates), dict));
}

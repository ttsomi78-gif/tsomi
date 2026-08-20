/**
 * Business facts shown on the legal pages (terms, privacy, shipping, contact).
 * One place on purpose: when the legal entity name arrives, edit here and
 * every page and locale picks it up.
 */
export const company = {
  /** Brand name as customers know it. */
  brand: "TSOMI",
  /** Registered legal entity behind the shop. */
  legalName: "Turkun Studio LLC",
  legalNameKa: "შპს ტურკუნ სტუდიო",
  phone: "+995 591 93 50 03",
  /** tel: link — digits only. */
  phoneHref: "+995591935003",
  city: "Tbilisi, Georgia",
  cityKa: "თბილისი, საქართველო",
  instagram: "@tsomi.streetwear",
  /** Days a customer has to request a return. */
  returnDays: 14,
  /** Typical delivery window across Georgia, in business days. */
  deliveryDays: "2–5",
} as const;

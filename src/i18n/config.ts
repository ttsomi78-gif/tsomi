import { locales, type LocaleId } from "@/lib/products";

export { locales, type LocaleId };
export const defaultLocale: LocaleId = "en";

export function isLocale(value: string): value is LocaleId {
  return (locales as readonly string[]).includes(value);
}

import type { LocaleId } from "@/lib/products";

/**
 * The canonical product colors. The admin picks from this list (a dropdown,
 * not free text), `product_variants.color_name` stores the ID, and the
 * storefront renders the label translated per locale.
 *
 * IDs are stable — renaming a label is safe, changing an ID would orphan
 * existing variants.
 */
export type PaletteColor = {
  id: string;
  hex: string;
  labels: Record<LocaleId, string>;
};

export const COLOR_PALETTE: PaletteColor[] = [
  { id: "black", hex: "#1f1c18", labels: { en: "Black", ka: "შავი", ru: "Чёрный", ja: "ブラック" } },
  { id: "white", hex: "#f7f5f0", labels: { en: "White", ka: "თეთრი", ru: "Белый", ja: "ホワイト" } },
  { id: "cream", hex: "#f2e9d8", labels: { en: "Cream", ka: "კრემისფერი", ru: "Кремовый", ja: "クリーム" } },
  { id: "beige", hex: "#d9c7a7", labels: { en: "Beige", ka: "ბეჟი", ru: "Бежевый", ja: "ベージュ" } },
  { id: "brown", hex: "#6b4a2f", labels: { en: "Brown", ka: "ყავისფერი", ru: "Коричневый", ja: "ブラウン" } },
  { id: "gray", hex: "#8d8d88", labels: { en: "Gray", ka: "ნაცრისფერი", ru: "Серый", ja: "グレー" } },
  { id: "red", hex: "#b3261e", labels: { en: "Red", ka: "წითელი", ru: "Красный", ja: "レッド" } },
  { id: "terracotta", hex: "#b34e28", labels: { en: "Terracotta", ka: "აგურისფერი", ru: "Терракотовый", ja: "テラコッタ" } },
  { id: "orange", hex: "#e07b2a", labels: { en: "Orange", ka: "ნარინჯისფერი", ru: "Оранжевый", ja: "オレンジ" } },
  { id: "yellow", hex: "#e5b32a", labels: { en: "Yellow", ka: "ყვითელი", ru: "Жёлтый", ja: "イエロー" } },
  { id: "green", hex: "#3f6b3a", labels: { en: "Green", ka: "მწვანე", ru: "Зелёный", ja: "グリーン" } },
  { id: "olive", hex: "#7a7a3d", labels: { en: "Olive", ka: "ზეთისხილისფერი", ru: "Оливковый", ja: "オリーブ" } },
  { id: "blue", hex: "#2f5d8a", labels: { en: "Blue", ka: "ლურჯი", ru: "Синий", ja: "ブルー" } },
  { id: "navy", hex: "#1e2a44", labels: { en: "Navy", ka: "მუქი ლურჯი", ru: "Тёмно-синий", ja: "ネイビー" } },
  { id: "purple", hex: "#6b4a8a", labels: { en: "Purple", ka: "იისფერი", ru: "Фиолетовый", ja: "パープル" } },
  { id: "pink", hex: "#d98aa6", labels: { en: "Pink", ka: "ვარდისფერი", ru: "Розовый", ja: "ピンク" } },
];

const byId = new Map(COLOR_PALETTE.map((color) => [color.id, color]));

export function paletteColor(id: string | null | undefined): PaletteColor | null {
  if (!id) return null;
  return byId.get(id.toLowerCase()) ?? null;
}

/**
 * Display label for a stored color, translated. Variants created before the
 * palette existed hold free text ("Black") — those fall through as-is, so
 * old orders and un-migrated products keep rendering.
 */
export function colorLabel(
  id: string | null | undefined,
  locale: LocaleId,
): string {
  if (!id) return "";
  return paletteColor(id)?.labels[locale] ?? id;
}

/** Swatch hex for a stored color, with the same legacy fallback. */
export function colorHexOf(
  id: string | null | undefined,
  storedHex: string | null | undefined,
): string {
  return paletteColor(id)?.hex ?? storedHex ?? "#d2bd9c";
}

"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { categories, locales, localeLabels, type LocaleId } from "@/lib/products";
import { createProduct, updateProduct, type ProductFormState } from "./actions";

const initialState: ProductFormState = undefined;

const inputClass =
  "w-full rounded-lg border border-tan/60 bg-cream px-4 py-2.5 text-ink transition-colors focus:border-ink focus:outline-none";

/** Shape the edit page hands in — every localized field is nullable except the English ones. */
export type EditableProduct = {
  id: string;
  nameEn: string;
  nameRu: string | null;
  nameKa: string | null;
  nameJa: string | null;
  price: number;
  category: string;
  image: string;
  hoverImage?: string;
  altEn: string;
  altRu: string | null;
  altKa: string | null;
  altJa: string | null;
  tagEn: string | null;
  tagRu: string | null;
  tagKa: string | null;
  tagJa: string | null;
  stock: number;
};

export function ProductForm({ product }: { product?: EditableProduct }) {
  const action = product ? updateProduct.bind(null, product.id) : createProduct;
  const [state, formAction] = useActionState(action, initialState);
  const [activeLocale, setActiveLocale] = useState<LocaleId>("en");

  return (
    <form action={formAction} className="max-w-2xl space-y-10">
      <section className="space-y-5">
        <SectionHeading title="Basics" description="Category, price and inventory — shown the same in every language." />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select
              name="category"
              defaultValue={product?.category ?? categories[0].id}
              required
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Price (GEL)">
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price}
              required
              className={inputClass}
            />
          </Field>

          <Field label="Stock (units available)">
            <input
              name="stock"
              type="number"
              step="1"
              min="0"
              defaultValue={product?.stock ?? 0}
              required
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          title="Product copy"
          description="English is required. Leave other languages blank to fall back to English automatically."
        />

        <div className="flex gap-1 rounded-full border border-tan/60 bg-blush p-1">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => setActiveLocale(locale)}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                activeLocale === locale
                  ? "bg-ink text-cream"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              {localeLabels[locale]}
              {locale === "en" && <span className="ml-1 text-terracotta">*</span>}
            </button>
          ))}
        </div>

        {locales.map((locale) => (
          <div
            key={locale}
            hidden={activeLocale !== locale}
            className="space-y-5 rounded-2xl border border-tan/60 bg-cream/60 p-5"
          >
            <Field label={`Name${locale === "en" ? "" : " (optional)"}`}>
              <input
                name={`name${capitalize(locale)}`}
                defaultValue={localizedValue(product, "name", locale) ?? undefined}
                required={locale === "en"}
                className={inputClass}
                lang={locale}
              />
            </Field>

            <Field label={`Alt text (for accessibility)${locale === "en" ? "" : " (optional)"}`}>
              <input
                name={`alt${capitalize(locale)}`}
                defaultValue={localizedValue(product, "alt", locale) ?? undefined}
                required={locale === "en"}
                className={inputClass}
                lang={locale}
              />
            </Field>

            <Field label="Tag (optional — e.g. New, Best seller)">
              <input
                name={`tag${capitalize(locale)}`}
                defaultValue={localizedValue(product, "tag", locale) ?? undefined}
                className={inputClass}
                lang={locale}
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <SectionHeading title="Photos" description="JPG or PNG. The hover photo is optional." />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={product ? "Replace photo (optional)" : "Photo"}>
            <input
              name="image"
              type="file"
              accept="image/*"
              required={!product}
              className={inputClass}
            />
            {product && (
              <p className="mt-1.5 text-xs text-ink/50">
                Leave empty to keep the current photo.
              </p>
            )}
          </Field>

          <Field label="Hover photo (optional)">
            <input
              name="hoverImage"
              type="file"
              accept="image/*"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {state?.error && (
        <p className="text-sm font-semibold text-brick">{state.error}</p>
      )}

      <SubmitButton isEdit={!!product} />
    </form>
  );
}

function localizedValue(
  product: EditableProduct | undefined,
  field: "name" | "alt" | "tag",
  locale: LocaleId,
): string | null | undefined {
  if (!product) return undefined;
  const key = `${field}${capitalize(locale)}` as keyof EditableProduct;
  return product[key] as string | null | undefined;
}

function capitalize(locale: LocaleId): string {
  return locale === "en" ? "En" : locale === "ru" ? "Ru" : locale === "ka" ? "Ka" : "Ja";
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-tan/60 pb-3">
      <h2 className="font-display text-lg uppercase tracking-wide">{title}</h2>
      <p className="mt-1 text-sm text-ink/60">{description}</p>
    </div>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-yolk px-8 py-3 font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/70">
        {label}
      </span>
      {children}
    </label>
  );
}

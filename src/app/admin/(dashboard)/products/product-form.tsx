"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { categories, locales, localeLabels, type LocaleId } from "@/lib/products";
import { updateProduct, type ProductFormState } from "./actions";

const initialState: ProductFormState = undefined;

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900";

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
  descriptionEn: string | null;
  descriptionRu: string | null;
  descriptionKa: string | null;
  descriptionJa: string | null;
  stock: number;
};

export function ProductForm({
  product,
  stockManagedByColors = false,
}: {
  product?: EditableProduct;
  /** True once the product has color/size variants — their sum owns the stock. */
  stockManagedByColors?: boolean;
}) {
  // Creation now goes through the single-screen wizard (new-product-form);
  // this form only ever edits an existing product.
  if (!product) throw new Error("ProductForm requires a product — use the create wizard");
  const action = updateProduct.bind(null, product.id);
  const [state, formAction] = useActionState(action, initialState);
  const [activeLocale, setActiveLocale] = useState<LocaleId>("en");
  const formRef = useRef<HTMLFormElement>(null);
  const [revealInvalid, setRevealInvalid] = useState(false);
  // Names are controlled so the "shown on the site as" strip below can show
  // the effective name per language while the admin types.
  const [names, setNames] = useState<Record<LocaleId, string>>({
    en: product.nameEn,
    ru: product.nameRu ?? "",
    ka: product.nameKa ?? "",
    ja: product.nameJa ?? "",
  });

  // A required field inside a hidden locale panel can't be focused by the
  // browser, which silently blocks submission. When that happens, switch to
  // the tab that owns the field, then re-run validation so the message shows.
  useEffect(() => {
    if (!revealInvalid) return;
    setRevealInvalid(false);
    formRef.current?.reportValidity();
  }, [revealInvalid]);

  function handleInvalid(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name ?? "";
    const owner = locales.find((locale) => name.endsWith(capitalize(locale)));
    if (owner && owner !== activeLocale) {
      event.preventDefault();
      setActiveLocale(owner);
      setRevealInvalid(true);
    }
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onInvalidCapture={handleInvalid}
      className="max-w-2xl space-y-10"
    >
      <section className="space-y-5">
        <SectionHeading title="Basics" description="Category and price — shown the same in every language." />

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

          {/* Stock is never typed on creation — a new product starts at 0 and
              gets its inventory in the per-color editor right after. On edit,
              the flat field exists only for products without colors, and locks
              itself the moment colors own the stock. */}
          {product === undefined ? (
            <input type="hidden" name="stock" value={0} />
          ) : stockManagedByColors ? (
            <Field label="Stock — managed per color & size below">
              <input type="hidden" name="stock" value={product.stock} />
              <input
                type="number"
                defaultValue={product.stock}
                disabled
                title="This product has colors — the total is the sum of the quantities below"
                className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
              />
            </Field>
          ) : (
            <Field label="Stock (no colors yet — or add them below)">
              <input
                name="stock"
                type="number"
                step="1"
                min="0"
                defaultValue={product.stock}
                required
                className={inputClass}
              />
            </Field>
          )}
        </div>

        {product === undefined && (
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            Photos per color, sizes and quantities are set on the next screen —
            create the product first and you&apos;ll land there.
          </p>
        )}
      </section>

      <section className="space-y-5">
        <SectionHeading
          title="Product copy"
          description="One tab per language. English is required; a language left blank shows the English text on that version of the site."
        />

        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {locales.map((locale) => {
            const own = names[locale].trim().length > 0;
            return (
              <button
                key={locale}
                type="button"
                onClick={() => setActiveLocale(locale)}
                className={`flex-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  activeLocale === locale
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {localeLabels[locale]}
                {locale === "en" ? (
                  <span className="ml-1 text-red-500">*</span>
                ) : (
                  /* Green: has its own name. Gray: shows the English one. */
                  <span
                    aria-hidden="true"
                    title={own ? "Has its own name" : "Shows the English name"}
                    className={`ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                      own ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {locales.map((locale) => (
          <div
            key={locale}
            hidden={activeLocale !== locale}
            className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <Field label={`Name${locale === "en" ? "" : " (optional)"}`}>
              <input
                name={`name${capitalize(locale)}`}
                value={names[locale]}
                onChange={(event) =>
                  setNames((current) => ({ ...current, [locale]: event.target.value }))
                }
                required={locale === "en"}
                className={inputClass}
                lang={locale}
              />
            </Field>
            {locale !== "en" && !names[locale].trim() && (
              <p className="-mt-2 text-xs text-gray-400">
                Blank — the {localeLabels[locale]} site shows the English name
                {names.en.trim() ? ` “${names.en.trim()}”` : ""}.
              </p>
            )}

            <Field
              label={`Description — shown on the product page${locale === "en" ? "" : " (optional)"}`}
            >
              <textarea
                name={`description${capitalize(locale)}`}
                defaultValue={localizedValue(product, "description", locale) ?? undefined}
                rows={5}
                maxLength={5000}
                placeholder="The story behind this piece, the fabric, the fit… Line breaks are kept."
                className={`${inputClass} min-h-28 resize-y`}
                lang={locale}
              />
            </Field>

            <Field label="Tag (optional — short badge on the photo, e.g. New, Best seller)">
              <input
                name={`tag${capitalize(locale)}`}
                defaultValue={localizedValue(product, "tag", locale) ?? undefined}
                className={inputClass}
                lang={locale}
              />
            </Field>

            <Field
              label={`Image alt text${locale === "en" ? "" : " (optional)"} — for screen readers and Google, never shown on the page`}
            >
              <input
                name={`alt${capitalize(locale)}`}
                defaultValue={localizedValue(product, "alt", locale) ?? undefined}
                required={locale === "en"}
                className={inputClass}
                lang={locale}
              />
            </Field>
          </div>
        ))}

        {/* The effective name per language — answers "I changed the name and
            the site didn't change" (it was changed in a different tab). */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Name shown on each version of the site
          </p>
          <dl className="grid gap-1 sm:grid-cols-2">
            {locales.map((locale) => {
              const own = names[locale].trim();
              return (
                <div key={locale} className="flex items-baseline gap-2">
                  <dt className="w-16 shrink-0 text-gray-500">{localeLabels[locale]}</dt>
                  <dd className="truncate font-medium text-gray-900">
                    {own || names.en.trim() || "—"}
                    {!own && locale !== "en" && (
                      <span className="ml-1 font-normal text-gray-400">(English)</span>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* No photo fields here on purpose: photos live in the color cards
          below, and the catalog cover is automatically the first photo. */}
      <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
        Photos are managed per color below. The first photo automatically
        becomes the catalog cover.
      </p>

      {state?.error && (
        <p className="text-sm font-medium text-red-600">{state.error}</p>
      )}

      <SubmitButton isEdit={!!product} />
    </form>
  );
}

function localizedValue(
  product: EditableProduct | undefined,
  field: "name" | "alt" | "tag" | "description",
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
    <div className="border-b border-gray-200 pb-3">
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-0.5 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 px-6 py-2.5"
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
      <span className="mb-1.5 block text-[13px] font-medium text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}

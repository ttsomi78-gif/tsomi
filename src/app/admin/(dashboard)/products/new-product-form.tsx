"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { createProductWithColors, type ProductFormState } from "./actions";
import { categories } from "@/lib/products";

const LOCALES = [
  { id: "en", label: "English", required: true },
  { id: "ru", label: "Russian", required: false },
  { id: "ka", label: "Georgian", required: false },
  { id: "ja", label: "Japanese", required: false },
] as const;

type LocaleTab = (typeof LOCALES)[number]["id"];

const FIELD_SUFFIX: Record<LocaleTab, string> = {
  en: "En",
  ru: "Ru",
  ka: "Ka",
  ja: "Ja",
};

type SizeRow = { key: string; size: string; stock: number };
type ColorBlock = {
  key: string;
  name: string;
  hex: string;
  sizes: SizeRow[];
  /** Object URLs previewing the files currently in this card's file input. */
  previews: string[];
  fileCount: number;
};

let keyCounter = 0;
const newKey = () => `k-${keyCounter++}`;

const COMMON_SIZES = ["S", "M", "L", "XL"];

const inputClass =
  "w-full rounded-lg border border-tan/60 bg-cream px-3 py-2 text-sm focus:border-ink focus:outline-none";

/**
 * Single-screen product creation: globals (translated name/tag, category,
 * price) on top, then one self-contained block per color — its photos, its
 * sizes, quantity per size. One submit creates everything; the first photo
 * becomes the catalog cover and total stock is the sum of the blocks.
 */
export function NewProductForm() {
  const [state, formAction] = useActionState<ProductFormState, FormData>(
    createProductWithColors,
    undefined,
  );
  const [activeLocale, setActiveLocale] = useState<LocaleTab>("en");
  const [colors, setColors] = useState<ColorBlock[]>([
    { key: newKey(), name: "", hex: "#27211a", sizes: [], previews: [], fileCount: 0 },
  ]);

  const totalStock = colors.reduce(
    (sum, color) =>
      sum + color.sizes.reduce((s, row) => s + (Number(row.stock) || 0), 0),
    0,
  );

  function patchColor(key: string, patch: Partial<ColorBlock>) {
    setColors((current) =>
      current.map((color) => (color.key === key ? { ...color, ...patch } : color)),
    );
  }

  function patchSize(colorKey: string, sizeKey: string, patch: Partial<SizeRow>) {
    setColors((current) =>
      current.map((color) =>
        color.key === colorKey
          ? {
              ...color,
              sizes: color.sizes.map((row) =>
                row.key === sizeKey ? { ...row, ...patch } : row,
              ),
            }
          : color,
      ),
    );
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      {/* the color/size grid rides as JSON; the files ride in the per-card
          file inputs below under photos_{index} */}
      <input
        type="hidden"
        name="colors"
        value={JSON.stringify(
          colors.map((color) => ({
            colorName: color.name,
            colorHex: color.hex,
            sizes: color.sizes.map((row) => ({
              size: row.size,
              stock: Number(row.stock) || 0,
            })),
            photoCount: color.fileCount,
          })),
        )}
      />

      {/* ── globals ── */}
      <section className="space-y-4">
        <h2 className="border-b border-tan/60 pb-2 font-display text-lg uppercase tracking-wide">
          Basics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
              Category
            </span>
            <select name="category" required className={inputClass}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
              Price (GEL)
            </span>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              className={inputClass}
            />
          </label>
        </div>

        <div>
          <div className="flex gap-1 rounded-full bg-sand/70 p-1">
            {LOCALES.map((locale) => (
              <button
                key={locale.id}
                type="button"
                onClick={() => setActiveLocale(locale.id)}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                  activeLocale === locale.id
                    ? "bg-ink text-cream"
                    : "text-ink/55 hover:text-ink"
                }`}
              >
                {locale.label}
                {locale.required && <span className="ml-0.5 text-terracotta">*</span>}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/45">
            English is required. Any language left blank shows English on the
            site automatically.
          </p>

          {LOCALES.map((locale) => (
            <div
              key={locale.id}
              className={`mt-3 grid gap-4 sm:grid-cols-2 ${
                activeLocale === locale.id ? "" : "hidden"
              }`}
            >
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
                  Name {locale.required && "(required)"}
                </span>
                <input
                  name={`name${FIELD_SUFFIX[locale.id]}`}
                  type="text"
                  required={locale.required}
                  // A required field hidden inside an inactive tab can't be
                  // focused by the browser — jump to its tab so the message shows.
                  onInvalid={() => setActiveLocale(locale.id)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
                  Tag (optional — e.g. NEW)
                </span>
                <input
                  name={`tag${FIELD_SUFFIX[locale.id]}`}
                  type="text"
                  className={inputClass}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* ── color blocks ── */}
      <section className="space-y-4">
        <h2 className="border-b border-tan/60 pb-2 font-display text-lg uppercase tracking-wide">
          Colors, photos &amp; sizes
        </h2>

        {colors.map((color, index) => (
          <div key={color.key} className="rounded-2xl border border-tan/60 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="color"
                value={color.hex}
                aria-label="Swatch color"
                onChange={(event) => patchColor(color.key, { hex: event.target.value })}
                className="h-10 w-12 cursor-pointer rounded-lg border border-tan/60 bg-cream p-1"
              />
              <input
                type="text"
                value={color.name}
                placeholder="Color name — Black"
                aria-label="Color name"
                onChange={(event) => patchColor(color.key, { name: event.target.value })}
                className="w-44 rounded-lg border border-tan/60 bg-cream px-3 py-2 text-sm font-bold focus:border-ink focus:outline-none"
              />
              <span className="text-sm text-ink/50">
                {color.sizes.reduce((s, row) => s + (Number(row.stock) || 0), 0)} pcs
              </span>
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setColors((current) => current.filter((c) => c.key !== color.key))
                  }
                  className="ml-auto text-sm font-semibold text-ink/40 underline decoration-2 underline-offset-4 hover:text-brick"
                >
                  Remove color
                </button>
              )}
            </div>

            <div className="mt-3">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
                Photos of this color
              </span>
              {color.previews.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {color.previews.map((src) => (
                    <span
                      key={src}
                      className="relative block h-20 w-16 overflow-hidden rounded-lg border border-tan/50 bg-sand"
                    >
                      <Image src={src} alt="" fill sizes="64px" className="object-cover" unoptimized />
                    </span>
                  ))}
                </div>
              )}
              <input
                type="file"
                name={`photos_${index}`}
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={(event) => {
                  const files = [...(event.target.files ?? [])];
                  color.previews.forEach((url) => URL.revokeObjectURL(url));
                  patchColor(color.key, {
                    previews: files.map((file) => URL.createObjectURL(file)),
                    fileCount: files.length,
                  });
                }}
                className="block text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-cream hover:file:bg-terracotta"
              />
            </div>

            <div className="mt-4 space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wide text-ink/55">
                Sizes &amp; quantity
              </span>
              {color.sizes.map((row) => (
                <div key={row.key} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.size}
                    placeholder="M  (empty = one size)"
                    onChange={(event) =>
                      patchSize(color.key, row.key, {
                        size: event.target.value.toUpperCase(),
                      })
                    }
                    className="w-40 rounded-lg border border-tan/60 bg-cream px-3 py-1.5 text-sm uppercase focus:border-ink focus:outline-none"
                  />
                  <input
                    type="number"
                    min={0}
                    value={row.stock}
                    aria-label={`Quantity for ${row.size || "one size"}`}
                    onChange={(event) =>
                      patchSize(color.key, row.key, {
                        stock: Number(event.target.value),
                      })
                    }
                    className="w-24 rounded-lg border border-tan/60 bg-cream px-3 py-1.5 text-sm tabular-nums focus:border-ink focus:outline-none"
                  />
                  <span className="text-xs text-ink/40">pcs</span>
                  <button
                    type="button"
                    onClick={() =>
                      patchColor(color.key, {
                        sizes: color.sizes.filter((r) => r.key !== row.key),
                      })
                    }
                    className="ml-1 text-xs font-semibold text-ink/40 underline decoration-2 underline-offset-4 hover:text-brick"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    patchColor(color.key, {
                      sizes: [...color.sizes, { key: newKey(), size: "", stock: 0 }],
                    })
                  }
                  className="rounded-full border-2 border-ink px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  + Size
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const have = new Set(color.sizes.map((row) => row.size));
                    patchColor(color.key, {
                      sizes: [
                        ...color.sizes,
                        ...COMMON_SIZES.filter((size) => !have.has(size)).map(
                          (size) => ({ key: newKey(), size, stock: 0 }),
                        ),
                      ],
                    });
                  }}
                  className="rounded-full border-2 border-tan/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink/60 transition-colors hover:border-ink hover:text-ink"
                >
                  + S–XL
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setColors((current) => [
              ...current,
              {
                key: newKey(),
                name: "",
                hex: "#27211a",
                sizes: [],
                previews: [],
                fileCount: 0,
              },
            ])
          }
          className="w-full rounded-2xl border-2 border-dashed border-tan px-4 py-4 text-sm font-bold uppercase tracking-wide text-ink/55 transition-colors hover:border-ink hover:text-ink"
        >
          + Add color
        </button>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-tan/60 pt-5">
        <p className="text-sm text-ink/55">
          Total stock:{" "}
          <span className="font-bold text-ink tabular-nums">{totalStock}</span>{" "}
          — counted automatically
        </p>
        <SubmitButton />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-2xl bg-brick/10 px-4 py-3 text-sm font-semibold text-brick">
          {state.error}
        </p>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ml-auto rounded-full bg-yolk px-8 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Creating…" : "Create product"}
    </button>
  );
}

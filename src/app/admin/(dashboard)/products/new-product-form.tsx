"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import Image from "next/image";
import { createProductWithColors, type ProductFormState } from "./actions";
import { categories } from "@/lib/products";
import { COLOR_PALETTE, paletteColor } from "@/lib/colors";

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

type Photo = { key: string; file: File; preview: string };
type SizeRow = { key: string; size: string; stock: number };
type ColorBlock = {
  key: string;
  /** Palette ID from COLOR_PALETTE — empty until the admin picks one. */
  colorId: string;
  sizes: SizeRow[];
  photos: Photo[];
};

let keyCounter = 0;
const newKey = () => `k-${keyCounter++}`;

const COMMON_SIZES = ["S", "M", "L", "XL"];
const MAX_PHOTOS_PER_COLOR = 8;

const inputClass =
  "w-full rounded-lg border border-tan/60 bg-cream px-3 py-2 text-sm focus:border-ink focus:outline-none";

/**
 * Single-screen product creation. Photos live in React state as File objects
 * and are appended to the FormData at submit time — never in the DOM's file
 * inputs, whose contents silently reset when React re-renders a growing list
 * (the "second color wiped my first color's photo" bug).
 */
export function NewProductForm() {
  const [state, formAction, isPending] = useActionState<ProductFormState, FormData>(
    createProductWithColors,
    undefined,
  );
  const [activeLocale, setActiveLocale] = useState<LocaleTab>("en");
  const [colors, setColors] = useState<ColorBlock[]>([
    { key: newKey(), colorId: "", sizes: [], photos: [] },
  ]);
  const formRef = useRef<HTMLFormElement>(null);

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

  function addPhotos(colorKey: string, files: File[]) {
    if (files.length === 0) return;
    setColors((current) =>
      current.map((color) => {
        if (color.key !== colorKey) return color;
        const room = MAX_PHOTOS_PER_COLOR - color.photos.length;
        const additions = files.slice(0, Math.max(room, 0)).map((file) => ({
          key: newKey(),
          file,
          preview: URL.createObjectURL(file),
        }));
        return { ...color, photos: [...color.photos, ...additions] };
      }),
    );
  }

  function removePhoto(colorKey: string, photoKey: string) {
    setColors((current) =>
      current.map((color) => {
        if (color.key !== colorKey) return color;
        const photo = color.photos.find((p) => p.key === photoKey);
        if (photo) URL.revokeObjectURL(photo.preview);
        return { ...color, photos: color.photos.filter((p) => p.key !== photoKey) };
      }),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    // Text fields come off the form; the photos come off state, keyed by the
    // color's render index to match the server's photos_{i} contract.
    const formData = new FormData(form);
    colors.forEach((color, index) => {
      color.photos.forEach((photo) => formData.append(`photos_${index}`, photo.file));
    });
    startTransition(() => formAction(formData));
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <input
        type="hidden"
        name="colors"
        value={JSON.stringify(
          colors.map((color) => ({
            colorName: color.colorId,
            sizes: color.sizes.map((row) => ({
              size: row.size,
              stock: Number(row.stock) || 0,
            })),
            photoCount: color.photos.length,
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

        {colors.map((color) => (
          <div key={color.key} className="rounded-2xl border border-tan/60 p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Swatch preview follows the dropdown — the palette owns the hex. */}
              <span
                aria-hidden="true"
                className="h-9 w-9 rounded-full border border-ink/15 shadow-sm"
                style={{
                  backgroundColor: paletteColor(color.colorId)?.hex ?? "#eaddc6",
                }}
              />
              <select
                value={color.colorId}
                aria-label="Color"
                onChange={(event) =>
                  patchColor(color.key, { colorId: event.target.value })
                }
                required
                className="w-44 rounded-lg border border-tan/60 bg-cream px-3 py-2 text-sm font-bold focus:border-ink focus:outline-none"
              >
                <option value="" disabled>
                  Choose color…
                </option>
                {COLOR_PALETTE.map((option) => (
                  <option
                    key={option.id}
                    value={option.id}
                    disabled={colors.some(
                      (c) => c.key !== color.key && c.colorId === option.id,
                    )}
                  >
                    {option.labels.en}
                  </option>
                ))}
              </select>
              <span className="text-sm text-ink/50">
                {color.sizes.reduce((s, row) => s + (Number(row.stock) || 0), 0)} pcs
              </span>
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    color.photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
                    setColors((current) => current.filter((c) => c.key !== color.key));
                  }}
                  className="ml-auto text-sm font-semibold text-ink/40 underline decoration-2 underline-offset-4 hover:text-brick"
                >
                  Remove color
                </button>
              )}
            </div>

            {/* photo tiles: thumbnails with ✕, plus a dashed add tile */}
            <div className="mt-4">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
                Photos of this color
              </span>
              <div className="flex flex-wrap gap-2">
                {color.photos.map((photo) => (
                  <span
                    key={photo.key}
                    className="group relative block h-24 w-20 overflow-hidden rounded-xl border border-tan/50 bg-sand"
                  >
                    <Image
                      src={photo.preview}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(color.key, photo.key)}
                      aria-label="Remove photo"
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-[10px] font-bold text-cream opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {color.photos.length < MAX_PHOTOS_PER_COLOR && (
                  <label className="flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-tan text-ink/40 transition-colors hover:border-ink hover:text-ink">
                    <span className="text-xl leading-none">+</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      Photo
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        // Snapshot NOW: FileList is live, and clearing the
                        // input below empties it before React's async state
                        // updater would otherwise read it.
                        const picked = [...(event.target.files ?? [])];
                        addPhotos(color.key, picked);
                        // Same file can be re-picked later — clear the input.
                        event.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
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
                      patchColor(color.key, {
                        sizes: color.sizes.map((r) =>
                          r.key === row.key
                            ? { ...r, size: event.target.value.toUpperCase() }
                            : r,
                        ),
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
                      patchColor(color.key, {
                        sizes: color.sizes.map((r) =>
                          r.key === row.key
                            ? { ...r, stock: Number(event.target.value) }
                            : r,
                        ),
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
              { key: newKey(), colorId: "", sizes: [], photos: [] },
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
        <button
          type="submit"
          disabled={isPending}
          className="ml-auto rounded-full bg-yolk px-8 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating…" : "Create product"}
        </button>
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-2xl bg-brick/10 px-4 py-3 text-sm font-semibold text-brick"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}

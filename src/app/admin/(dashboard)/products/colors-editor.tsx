"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  addProductImages,
  deleteProductImage,
  moveProductImage,
  removeColor,
  saveColor,
  type ColorFormState,
  type ImagesFormState,
} from "./actions";
import { COLOR_PALETTE, colorHexOf, paletteColor } from "@/lib/colors";

type GalleryImage = { id: string; url: string; colorName: string | null };
type SizeRow = { key: string; size: string; stock: number };
type ColorBlock = {
  colorName: string;
  colorHex: string;
  sizes: { size: string | null; stock: number }[];
  images: GalleryImage[];
  /** Not yet saved to the database — created by the "Add color" button. */
  draft: boolean;
};

let keyCounter = 0;
const newKey = () => `k-${keyCounter++}`;

const COMMON_SIZES = ["S", "M", "L", "XL"];

/**
 * One card per color: its photos, its sizes with per-size quantity, one save.
 * The product's total stock is derived server-side — nothing to fill by hand.
 */
export function ColorsEditor({
  productId,
  colors,
  sharedImages,
}: {
  productId: string;
  colors: ColorBlock[];
  sharedImages: GalleryImage[];
}) {
  const [drafts, setDrafts] = useState<ColorBlock[]>([]);
  const [newColorId, setNewColorId] = useState("");

  const existingNames = new Set(colors.map((color) => color.colorName));
  const blocks = [...colors, ...drafts.filter((d) => !existingNames.has(d.colorName))];
  const takenIds = new Set(blocks.map((block) => block.colorName));

  function addDraft() {
    const picked = paletteColor(newColorId);
    if (!picked || takenIds.has(picked.id)) return;
    setDrafts((current) => [
      ...current,
      {
        colorName: picked.id,
        colorHex: picked.hex,
        sizes: [],
        images: [],
        draft: true,
      },
    ]);
    setNewColorId("");
  }

  return (
    <section className="mt-10">
      <h2 className="text-[15px] font-semibold tracking-tight">
        Colors, photos & sizes
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        One card per color: upload its photos, list its sizes with the quantity
        of each, save. The product&apos;s total stock is the sum of everything
        below — you never type it yourself.
      </p>

      <div className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-gray-700">
            Color
          </span>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-9 w-9 rounded-full border border-gray-300 shadow-sm"
              style={{ backgroundColor: paletteColor(newColorId)?.hex ?? "#eaddc6" }}
            />
            <select
              value={newColorId}
              onChange={(event) => setNewColorId(event.target.value)}
              className="w-44 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">Choose color…</option>
              {COLOR_PALETTE.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                  disabled={takenIds.has(option.id)}
                >
                  {option.labels.en}
                </option>
              ))}
            </select>
          </div>
        </label>
        <button
          type="button"
          onClick={addDraft}
          disabled={!paletteColor(newColorId)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add color
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {blocks.map((block) => (
          <ColorCard key={block.colorName} productId={productId} block={block} />
        ))}
      </div>

      {sharedImages.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Photos shown for every color
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            Not tied to one color — includes photos left behind when a color was
            removed. Re-upload them inside a color card to reassign.
          </p>
          <PhotoStrip productId={productId} images={sharedImages} />
        </div>
      )}
    </section>
  );
}

function ColorCard({
  productId,
  block,
}: {
  productId: string;
  block: ColorBlock;
}) {
  const [rows, setRows] = useState<SizeRow[]>(
    block.sizes.map((row) => ({
      key: newKey(),
      size: row.size ?? "",
      stock: row.stock,
    })),
  );
  const [colorId, setColorId] = useState(block.colorName);
  const [state, formAction] = useActionState<ColorFormState, FormData>(
    saveColor.bind(null, productId, block.draft ? null : block.colorName),
    undefined,
  );
  /** Rows saved before the palette existed hold free text ("Black"). */
  const isLegacy = paletteColor(block.colorName) === null;

  const total = rows.reduce((sum, row) => sum + (Number(row.stock) || 0), 0);

  function update(key: string, patch: Partial<SizeRow>) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function addAllSizes() {
    setRows((current) => {
      const have = new Set(current.map((row) => row.size));
      return [
        ...current,
        ...COMMON_SIZES.filter((size) => !have.has(size)).map((size) => ({
          key: newKey(),
          size,
          stock: 0,
        })),
      ];
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span
          aria-hidden="true"
          className="h-9 w-9 rounded-full border border-gray-300 shadow-sm"
          style={{ backgroundColor: colorHexOf(colorId, block.colorHex) }}
        />
        <select
          value={colorId}
          onChange={(event) => setColorId(event.target.value)}
          aria-label="Color"
          className="w-44 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        >
          {/* Pre-palette rows keep their raw name selectable so the card
              renders; picking a real color and saving migrates the rows. */}
          {isLegacy && (
            <option value={block.colorName}>
              {block.colorName} (old — pick a color)
            </option>
          )}
          {COLOR_PALETTE.map((option) => (
            <option key={option.id} value={option.id}>
              {option.labels.en}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          {total} in stock
          {block.draft && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              not saved yet
            </span>
          )}
        </span>
        {!block.draft && (
          <form
            className="ml-auto"
            action={async () => {
              await removeColor(productId, block.colorName);
            }}
          >
            <button
              type="submit"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-red-600"
            >
              Remove color
            </button>
          </form>
        )}
      </div>

      {/* photos of this color — draft colors save sizes first, then upload */}
      {!block.draft && (
        <div className="mt-4">
          <PhotoStrip productId={productId} images={block.images} />
          <UploadForm productId={productId} colorName={block.colorName} />
        </div>
      )}

      <form action={formAction} className="mt-4">
        <input
          type="hidden"
          name="color"
          value={JSON.stringify({
            colorName: colorId,
            sizes: rows.map((row) => ({
              size: row.size,
              stock: Number(row.stock) || 0,
            })),
          })}
        />

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center gap-2">
              <input
                type="text"
                value={row.size}
                placeholder="M  (empty = one size)"
                onChange={(event) =>
                  update(row.key, { size: event.target.value.toUpperCase() })
                }
                className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm uppercase focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <input
                type="number"
                min={0}
                value={row.stock}
                aria-label={`Quantity for size ${row.size || "one size"}`}
                onChange={(event) =>
                  update(row.key, { stock: Number(event.target.value) })
                }
                className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm tabular-nums focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <span className="text-xs text-gray-400">pcs</span>
              <button
                type="button"
                onClick={() =>
                  setRows((current) => current.filter((r) => r.key !== row.key))
                }
                className="ml-1 text-xs font-medium text-gray-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setRows((current) => [
                ...current,
                { key: newKey(), size: "", stock: 0 },
              ])
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            + Size
          </button>
          <button
            type="button"
            onClick={addAllSizes}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            + S–XL
          </button>
          <SaveColorButton />
        </div>

        {state?.error && (
          <p className="mt-2 text-sm font-medium text-red-600">{state.error}</p>
        )}
        {state?.saved && !state.error && (
          <p className="mt-2 text-sm font-medium text-emerald-600">Saved</p>
        )}
      </form>
    </div>
  );
}

function SaveColorButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ml-auto rounded-lg bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save color"}
    </button>
  );
}

function UploadForm({
  productId,
  colorName,
}: {
  productId: string;
  colorName: string;
}) {
  const [state, formAction] = useActionState<ImagesFormState, FormData>(
    addProductImages.bind(null, productId),
    undefined,
  );
  return (
    /* Picking files submits immediately — there is no separate upload button
       to forget, which is exactly how photos used to get "lost". */
    <form action={formAction} className="mt-2">
      <input type="hidden" name="colorName" value={colorName} />
      <UploadTile />
      {state?.error && (
        <p className="mt-2 text-sm font-medium text-red-600">{state.error}</p>
      )}
      {state?.saved && !state.error && (
        <p className="mt-2 text-sm font-medium text-emerald-600">Photos uploaded</p>
      )}
    </form>
  );
}

function UploadTile() {
  const { pending } = useFormStatus();
  return (
    <label
      className={`flex h-24 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-gray-400 transition-colors ${
        pending
          ? "cursor-wait border-amber-400 text-amber-500"
          : "cursor-pointer border-gray-300 hover:border-gray-900 hover:text-gray-900"
      }`}
    >
      <span className="text-xl leading-none">{pending ? "…" : "+"}</span>
      <span className="text-[10px] font-bold uppercase tracking-wide">
        {pending ? "Uploading" : "Photo"}
      </span>
      <input
        type="file"
        name="images"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        disabled={pending}
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) event.target.form?.requestSubmit();
        }}
      />
    </label>
  );
}

function PhotoStrip({
  productId,
  images,
}: {
  productId: string;
  images: GalleryImage[];
}) {
  if (images.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-3">
      {images.map((image, index) => (
        <li key={image.id} className="w-24">
          <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <Image src={image.url} alt="" fill sizes="96px" className="object-cover" />
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex gap-0.5">
              <MoveButton
                productId={productId}
                imageId={image.id}
                direction="up"
                disabled={index === 0}
              />
              <MoveButton
                productId={productId}
                imageId={image.id}
                direction="down"
                disabled={index === images.length - 1}
              />
            </div>
            <form
              action={async () => {
                await deleteProductImage(productId, image.id);
              }}
            >
              <button
                type="submit"
                aria-label="Delete photo"
                className="text-xs font-medium text-gray-400 hover:text-red-600"
              >
                ✕
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MoveButton({
  productId,
  imageId,
  direction,
  disabled,
}: {
  productId: string;
  imageId: string;
  direction: "up" | "down";
  disabled: boolean;
}) {
  return (
    <form
      action={async () => {
        await moveProductImage(productId, imageId, direction);
      }}
    >
      <button
        type="submit"
        disabled={disabled}
        aria-label={direction === "up" ? "Move earlier" : "Move later"}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-gray-100"
      >
        {direction === "up" ? "←" : "→"}
      </button>
    </form>
  );
}

"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  addProductImages,
  deleteProductImage,
  moveProductImage,
  setProductImageColor,
  type ImagesFormState,
} from "./actions";

type GalleryImage = {
  id: string;
  url: string;
  colorName: string | null;
};

/**
 * Gallery manager: upload several photos at once and assign them to a color
 * (or to all colors). The order here is the order on the product page — the
 * first image of a color is its lead shot.
 */
export function ImagesEditor({
  productId,
  images,
  colorNames,
}: {
  productId: string;
  images: GalleryImage[];
  colorNames: string[];
}) {
  const [state, formAction] = useActionState<ImagesFormState, FormData>(
    addProductImages.bind(null, productId),
    undefined,
  );
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <section className="mt-10 rounded-2xl border border-tan/60 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl uppercase tracking-wide">
          Gallery images
        </h2>
        <p className="text-sm text-ink/50">
          {images.length === 0
            ? "No gallery yet — the product page shows the cover photo"
            : `${images.length} images`}
        </p>
      </div>
      <p className="mt-1 text-sm text-ink/50">
        Shown on the product page. Assign images to a color and the gallery
        switches when the customer picks that color; &quot;All colors&quot;
        images always show. First image per color is the lead shot.
      </p>

      {images.length > 0 && (
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="overflow-hidden rounded-xl border border-tan/50 bg-white/50"
            >
              <div className="relative aspect-4/5 bg-sand">
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-2.5">
                <form
                  action={async (formData: FormData) => {
                    await setProductImageColor(
                      productId,
                      image.id,
                      String(formData.get("colorName") ?? ""),
                    );
                  }}
                >
                  <select
                    name="colorName"
                    defaultValue={image.colorName ?? ""}
                    // Submit on change — no separate save button per card.
                    onChange={(event) => event.currentTarget.form?.requestSubmit()}
                    className="w-full rounded-lg border border-tan/60 bg-cream px-2 py-1.5 text-xs font-semibold focus:border-ink focus:outline-none"
                  >
                    <option value="">All colors</option>
                    {colorNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </form>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
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
                      className="text-xs font-semibold text-ink/40 underline decoration-2 underline-offset-4 transition-colors hover:text-brick"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        action={formAction}
        className="mt-5 flex flex-wrap items-end gap-3 rounded-xl bg-sand/50 p-4"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
            Photos (up to 8)
          </span>
          <input
            ref={fileInput}
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            required
            className="block text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-cream hover:file:bg-terracotta"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
            For color
          </span>
          <select
            name="colorName"
            className="rounded-lg border border-tan/60 bg-cream px-3 py-2 text-sm font-semibold focus:border-ink focus:outline-none"
          >
            <option value="">All colors</option>
            {colorNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <UploadButton />
        {state?.error && (
          <p className="w-full text-sm font-semibold text-brick">{state.error}</p>
        )}
        {state?.saved && !state.error && (
          <p className="w-full text-sm font-semibold text-green">Images added</p>
        )}
      </form>

      {colorNames.length === 0 && (
        <p className="mt-3 text-xs text-ink/45">
          Add color variants below first to be able to assign images per color.
        </p>
      )}
    </section>
  );
}

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-yolk px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Uploading…" : "Upload"}
    </button>
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
        className="flex h-7 w-7 items-center justify-center rounded-full bg-sand text-xs font-bold text-ink transition-colors hover:bg-yolk disabled:opacity-30 disabled:hover:bg-sand"
      >
        {direction === "up" ? "←" : "→"}
      </button>
    </form>
  );
}

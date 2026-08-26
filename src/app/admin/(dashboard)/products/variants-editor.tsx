"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveVariants, type VariantsFormState } from "./actions";

type Row = {
  /** Client-side key only — the server issues fresh ids on save. */
  key: string;
  colorName: string;
  colorHex: string;
  size: string;
  stock: number;
};

let keyCounter = 0;
function newKey() {
  return `row-${keyCounter++}`;
}

const COMMON_SIZES = ["S", "M", "L", "XL"];

/**
 * Color × size grid editor. Kept deliberately flat: a list of rows, each one
 * sellable combination. "Add all sizes" stamps out the usual S–XL run for the
 * color typed in the last row, which is the 90% case for tees.
 */
export function VariantsEditor({
  productId,
  initial,
}: {
  productId: string;
  initial: {
    colorName: string | null;
    colorHex: string | null;
    size: string | null;
    stock: number;
  }[];
}) {
  const [rows, setRows] = useState<Row[]>(
    initial.map((variant) => ({
      key: newKey(),
      colorName: variant.colorName ?? "",
      colorHex: variant.colorHex ?? "#27211a",
      size: variant.size ?? "",
      stock: variant.stock,
    })),
  );
  const [state, formAction] = useActionState<VariantsFormState, FormData>(
    saveVariants.bind(null, productId),
    undefined,
  );

  function update(key: string, patch: Partial<Row>) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function addRow() {
    const last = rows[rows.length - 1];
    setRows((current) => [
      ...current,
      {
        key: newKey(),
        colorName: last?.colorName ?? "",
        colorHex: last?.colorHex ?? "#27211a",
        size: "",
        stock: 0,
      },
    ]);
  }

  /** One row per S–XL for the last row's color — skips combos that exist. */
  function addAllSizes() {
    const last = rows[rows.length - 1];
    const colorName = last?.colorName ?? "";
    const colorHex = last?.colorHex ?? "#27211a";
    setRows((current) => {
      const have = new Set(current.map((row) => `${row.colorName}::${row.size}`));
      const additions = COMMON_SIZES.filter(
        (size) => !have.has(`${colorName}::${size}`),
      ).map((size) => ({ key: newKey(), colorName, colorHex, size, stock: 0 }));
      return [...current, ...additions];
    });
  }

  const totalStock = rows.reduce((sum, row) => sum + (Number(row.stock) || 0), 0);

  return (
    <section className="mt-10 rounded-2xl border border-tan/60 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl uppercase tracking-wide">
          Colors & sizes
        </h2>
        <p className="text-sm text-ink/50">
          {rows.length === 0
            ? "No variants — the product sells with its flat stock"
            : `${rows.length} variants · ${totalStock} total in stock`}
        </p>
      </div>
      <p className="mt-1 text-sm text-ink/50">
        Each row is one sellable combination. Leave size empty for one-size
        (bags); leave color empty if only sizes differ. Saving replaces the
        whole grid and sets the product&apos;s total stock to the sum.
      </p>

      <form action={formAction} className="mt-5">
        <input
          type="hidden"
          name="variants"
          value={JSON.stringify(
            rows.map((row) => ({
              colorName: row.colorName,
              colorHex: row.colorHex,
              size: row.size,
              stock: Number(row.stock) || 0,
            })),
          )}
        />

        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="py-2 pr-3">Color</th>
                  <th className="py-2 pr-3">Swatch</th>
                  <th className="py-2 pr-3">Size</th>
                  <th className="py-2 pr-3">Stock</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-t border-tan/40">
                    <td className="py-2 pr-3">
                      <input
                        type="text"
                        value={row.colorName}
                        placeholder="Black"
                        onChange={(event) =>
                          update(row.key, { colorName: event.target.value })
                        }
                        className="w-32 rounded-lg border border-tan/60 bg-cream px-3 py-1.5 focus:border-ink focus:outline-none"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="color"
                        value={row.colorHex}
                        aria-label={`Swatch color for ${row.colorName || "variant"}`}
                        onChange={(event) =>
                          update(row.key, { colorHex: event.target.value })
                        }
                        className="h-9 w-12 cursor-pointer rounded-lg border border-tan/60 bg-cream p-1"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="text"
                        value={row.size}
                        placeholder="M"
                        onChange={(event) =>
                          update(row.key, { size: event.target.value.toUpperCase() })
                        }
                        className="w-20 rounded-lg border border-tan/60 bg-cream px-3 py-1.5 uppercase focus:border-ink focus:outline-none"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        min={0}
                        value={row.stock}
                        onChange={(event) =>
                          update(row.key, { stock: Number(event.target.value) })
                        }
                        className="w-24 rounded-lg border border-tan/60 bg-cream px-3 py-1.5 tabular-nums focus:border-ink focus:outline-none"
                      />
                    </td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setRows((current) =>
                            current.filter((r) => r.key !== row.key),
                          )
                        }
                        className="text-sm font-semibold text-ink/40 underline decoration-2 underline-offset-4 transition-colors hover:text-brick"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addRow}
            className="rounded-full border-2 border-ink px-5 py-2 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            + Add variant
          </button>
          <button
            type="button"
            onClick={addAllSizes}
            className="rounded-full border-2 border-tan/60 px-5 py-2 text-xs font-bold uppercase tracking-wide text-ink/60 transition-colors hover:border-ink hover:text-ink"
          >
            + Add all sizes (S–XL)
          </button>
          <SaveButton />
        </div>

        {state?.error && (
          <p className="mt-3 text-sm font-semibold text-brick">{state.error}</p>
        )}
        {state?.saved && !state.error && (
          <p className="mt-3 text-sm font-semibold text-green">Variants saved</p>
        )}
      </form>
    </section>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ml-auto rounded-full bg-yolk px-6 py-2 text-xs font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save variants"}
    </button>
  );
}

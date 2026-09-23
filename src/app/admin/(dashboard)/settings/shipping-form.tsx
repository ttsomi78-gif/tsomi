"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateShippingRates, type ShippingRatesState } from "./actions";
import { tetriToGel } from "@/lib/money";
import { ZONE_COUNTRIES, countryName, type ShippingRates } from "@/lib/shipping";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm tabular-nums focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900";

const names = (codes: readonly string[]) =>
  codes.map((code) => countryName(code, "en")).join(", ");

const ZONES: { id: keyof ShippingRates; label: string; hint: string }[] = [
  {
    id: "georgia",
    label: "Georgia",
    hint: "Per order, anywhere in Georgia. 0 shows as “free” on the site.",
  },
  {
    id: "euA",
    label: "EU — courier tier 1 (7.5 €/kg)",
    hint: `${names(ZONE_COUNTRIES.euA)}. The courier charges ≈ 27.5 € for a parcel under 1 kg.`,
  },
  {
    id: "euB",
    label: "EU — every other member (8 €/kg)",
    hint: `${names(ZONE_COUNTRIES.euB)}. ≈ 28 € under 1 kg.`,
  },
  {
    id: "us",
    label: "USA",
    hint: "The courier charges ≈ 40 € for a parcel under 1 kg.",
  },
  {
    id: "cis",
    label: "Russia, Kazakhstan, Kyrgyzstan",
    hint: `${names(ZONE_COUNTRIES.cis)}. Your own flat figure per order.`,
  },
];

export function ShippingRatesForm({ rates }: { rates: ShippingRates }) {
  const [state, formAction] = useActionState<ShippingRatesState, FormData>(
    updateShippingRates,
    undefined,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {ZONES.map((zone) => (
          <label key={zone.id} className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-gray-700">
              {zone.label}
            </span>
            <div className="flex items-center gap-2">
              <input
                name={zone.id}
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={tetriToGel(rates[zone.id])}
                className={`${inputClass} max-w-40`}
              />
              <span className="text-sm text-gray-500">₾ per order</span>
            </div>
            <span className="mt-1 block text-xs leading-relaxed text-gray-400">{zone.hint}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <SaveButton />
        {state?.error && (
          <p className="text-sm font-medium text-red-600">{state.error}</p>
        )}
        {state?.saved && !state.error && (
          <p className="text-sm font-medium text-emerald-600">Saved — live on the site.</p>
        )}
      </div>
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save rates"}
    </button>
  );
}

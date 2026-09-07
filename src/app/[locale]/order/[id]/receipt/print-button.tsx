"use client";

/**
 * The browser's print dialog IS the download: every OS and phone offers
 * "Save as PDF" there, which sidesteps shipping a PDF library (and the
 * Georgian-font embedding it would drag in).
 */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-ink px-8 py-3 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-terracotta print:hidden"
    >
      {label}
    </button>
  );
}

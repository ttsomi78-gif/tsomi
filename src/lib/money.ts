/** Prices are stored in tetri (1 GEL = 100 tetri) to avoid float rounding bugs. */
export function gelToTetri(gel: number): number {
  return Math.round(gel * 100);
}

export function tetriToGel(tetri: number): number {
  return tetri / 100;
}

/** "89" for whole GEL, "89.90" when there are tetri — never "89.9". */
export function formatGel(gel: number): string {
  return Number.isInteger(gel) ? String(gel) : gel.toFixed(2);
}

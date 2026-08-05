/** Prices are stored in tetri (1 GEL = 100 tetri) to avoid float rounding bugs. */
export function gelToTetri(gel: number): number {
  return Math.round(gel * 100);
}

export function tetriToGel(tetri: number): number {
  return tetri / 100;
}

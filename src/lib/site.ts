/**
 * Canonical site origin — set SITE_URL in production (e.g. https://tsomi.ge).
 *
 * Read lazily at request time on purpose: a `NEXT_PUBLIC_` var (or a
 * module-level constant) would be frozen at `docker build` time, when no
 * real environment exists yet.
 */
export function getSiteUrl(): string {
  return process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

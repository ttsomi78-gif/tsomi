import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Product photo storage, on the server's own disk.
 *
 * In production `UPLOADS_DIR` points at a Docker volume mounted into the web
 * container — it must NOT live under `public/`, which is baked into the image
 * at build time and would drop every upload on the next deploy.
 *
 * Files are served back by `src/app/uploads/[name]/route.ts`.
 */

/** URL prefix the upload route serves from. Stored in `products.image_url`. */
export const UPLOADS_URL_PREFIX = "/uploads";

/** Matches `serverActions.bodySizeLimit` in next.config.ts. */
const MAX_BYTES = 10 * 1024 * 1024;

/** Allowed upload types → the extension we save under. */
const EXTENSION_BY_TYPE = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/gif", "gif"],
]);

/**
 * Exactly the shape `uploadProductImage` writes: a UUID plus a short extension.
 * The serving route reuses it, which is what makes path traversal impossible —
 * no slashes and no `..` can match.
 */
export const SAFE_UPLOAD_NAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{3,4}$/;

export function getUploadsDir(): string {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
}

/** Saves a product image and returns the URL to store on the product row. */
export async function uploadProductImage(file: File): Promise<string> {
  const extension = EXTENSION_BY_TYPE.get(file.type);
  if (!extension) {
    throw new Error(
      `Unsupported image type "${file.type || "unknown"}" — use JPEG, PNG, WebP, AVIF or GIF`,
    );
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is larger than 10MB");
  }

  // The name is ours, never the client's: an uploaded filename is attacker
  // input and has no business reaching a filesystem path.
  const name = `${randomUUID()}.${extension}`;
  const directory = getUploadsDir();

  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), Buffer.from(await file.arrayBuffer()));

  return `${UPLOADS_URL_PREFIX}/${name}`;
}

/** Best-effort delete of a previously uploaded product image. Never throws. */
export async function deleteProductImageByUrl(url: string | null | undefined) {
  if (!url || !url.startsWith(`${UPLOADS_URL_PREFIX}/`)) return;

  // Seeded products point at static `/products/*.jpg` files in the repo, and
  // older rows may hold a full remote URL. Neither is ours to delete.
  const name = url.slice(UPLOADS_URL_PREFIX.length + 1);
  if (!SAFE_UPLOAD_NAME.test(name)) return;

  try {
    await unlink(path.join(getUploadsDir(), name));
  } catch {
    // Orphaned file is an acceptable trade-off — never block the database
    // write on storage cleanup.
  }
}

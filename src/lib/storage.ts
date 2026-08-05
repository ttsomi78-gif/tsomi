import "server-only";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "products";

function getStorageClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/** Uploads a product image and returns its public URL. */
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = getStorageClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Best-effort delete of a previously uploaded product image. Never throws. */
export async function deleteProductImageByUrl(url: string | null | undefined) {
  if (!url) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return; // not a Supabase Storage URL (e.g. a static /public path) — nothing to clean up

  const path = url.slice(index + marker.length);
  try {
    const supabase = getStorageClient();
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // Orphaned file is an acceptable trade-off — never block the DB write on storage cleanup.
  }
}

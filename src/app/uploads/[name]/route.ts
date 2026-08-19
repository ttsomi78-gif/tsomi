import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { SAFE_UPLOAD_NAME, getUploadsDir } from "@/lib/storage";

// Reads from the uploads volume, so it needs the Node runtime.
export const runtime = "nodejs";

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

/**
 * Serves product photos out of the uploads volume.
 *
 * `next/image` requests these once per size and caches the optimized result, so
 * this handler is cold-path despite sitting in front of every product image.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  // The only defence that matters here: the name must match exactly what we
  // write. A path segment can't contain "/", but it can contain ".." — this
  // pattern admits neither.
  if (!SAFE_UPLOAD_NAME.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = path.join(getUploadsDir(), name);

  try {
    const info = await stat(file);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });

    const extension = name.split(".").pop() ?? "";
    return new NextResponse(new Uint8Array(await readFile(file)), {
      headers: {
        "Content-Type":
          CONTENT_TYPE_BY_EXTENSION[extension] ?? "application/octet-stream",
        "Content-Length": String(info.size),
        // Names are random and never reused, so a stored image is immutable.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

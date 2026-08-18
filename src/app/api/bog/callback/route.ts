import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyBogSignature, type BogOrderBody } from "@/lib/bog";
import { getOrderByBogId, settleOrder } from "@/lib/orders";
import { locales } from "@/lib/products";

// node:crypto signature verification needs the Node runtime, and a webhook must
// never be served from a cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CallbackPayload = {
  event?: string;
  body?: BogOrderBody;
};

/**
 * Bank of Georgia payment callback.
 *
 * Deliberate response policy: only a bad signature or a malformed body is an
 * error. Everything else — unknown event, unknown order, already-settled order —
 * returns 200. BOG retries non-2xx responses, and retrying a callback we can
 * never act on just generates noise forever.
 */
export async function POST(request: Request) {
  // The exact bytes BOG signed. Parsing first and re-serialising would change
  // key order and whitespace, and the signature would never verify again.
  const rawBody = await request.text();
  const signature = request.headers.get("callback-signature");

  if (!verifyBogSignature(rawBody, signature)) {
    console.error("[bog] rejected callback: invalid signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: CallbackPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "malformed body" }, { status: 400 });
  }

  if (payload.event !== "order_payment" || !payload.body) {
    console.warn("[bog] ignoring callback event:", payload.event);
    return NextResponse.json({ ok: true, ignored: true });
  }

  const body = payload.body;

  // `external_order_id` is our own order id. The BOG id is the fallback for the
  // window where we'd created the BOG order but not yet stored its id.
  let orderId = body.external_order_id ?? null;
  if (!orderId && body.order_id) {
    orderId = (await getOrderByBogId(body.order_id))?.id ?? null;
  }

  if (!orderId) {
    console.error("[bog] callback had no resolvable order id:", rawBody.slice(0, 300));
    return NextResponse.json({ ok: true, ignored: true });
  }

  const settled = await settleOrder(orderId, body);

  if (!settled) {
    console.error("[bog] callback for unknown order:", orderId);
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Stock moved, so the cached catalog is now stale.
  if (settled.status === "paid") {
    for (const locale of locales) {
      revalidatePath(`/${locale}`);
      revalidatePath(`/${locale}/catalog`);
    }
  }

  return NextResponse.json({ ok: true, status: settled.status });
}

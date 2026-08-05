import { SignJWT, jwtVerify } from "jose";

/**
 * Pure jose/Web Crypto helpers with no `next/headers` dependency, so this
 * module is safe to import from `middleware.ts` (Edge runtime, outside the
 * React Server Components graph — `server-only` and `next/headers` both
 * break there). Cookie reading/writing lives in `session.ts` instead.
 */

export const SESSION_COOKIE_NAME = "tsomi_admin_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(email: string) {
  return new SignJWT({ sub: email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return (payload.sub as string) ?? null;
  } catch {
    return null;
  }
}

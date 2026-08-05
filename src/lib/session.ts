import "server-only";
import { cookies } from "next/headers";
import {
  signSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "./jwt";

export async function createSession(email: string) {
  const token = await signSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** For use in Server Components/Actions — throws if there's no valid admin session. */
export async function requireAdminSession() {
  const cookieStore = await cookies();
  const email = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!email) throw new Error("Not authenticated");
  return email;
}

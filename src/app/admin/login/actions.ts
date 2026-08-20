"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set");
  }

  // Always run the bcrypt compare, even on an email mismatch, so a wrong
  // email doesn't return faster than a wrong password (timing side-channel).
  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);
  const emailMatches = email === adminEmail;

  if (!emailMatches || !passwordMatches) {
    return { error: "Invalid login or password" };
  }

  await createSession(adminEmail);
  redirect("/admin/products");
}

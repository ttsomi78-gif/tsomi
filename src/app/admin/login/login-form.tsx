"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

const initialState: LoginState = undefined;

const inputClass =
  "w-full rounded-lg border border-tan/60 bg-cream px-4 py-2.5 text-ink focus:border-ink focus:outline-none";

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/70">
          Login
        </span>
        {/* Plain text on purpose: the admin login is whatever ADMIN_EMAIL says,
            and the owner prefers a short name over an email address. */}
        <input
          name="email"
          type="text"
          autoComplete="username"
          required
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/70">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </label>

      {state?.error && (
        <p className="text-sm font-semibold text-brick">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-yolk px-8 py-3 font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

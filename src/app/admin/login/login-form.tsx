"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

const initialState: LoginState = undefined;

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900";

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-gray-700">
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
        <span className="mb-1.5 block text-[13px] font-medium text-gray-700">
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
        <p className="text-sm font-medium text-red-600">{state.error}</p>
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
      className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 py-2.5"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

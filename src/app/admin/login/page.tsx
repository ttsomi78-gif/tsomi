import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — TSOMI Admin",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-tan/60 bg-blush p-8">
        <h1 className="mb-6 font-display text-2xl uppercase tracking-wide">
          Admin sign in
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}

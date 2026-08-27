"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { WarningCircle } from "@phosphor-icons/react";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(next);
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Something went wrong. Please try again.");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <WarningCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      ) : null}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-charcoal-600">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-charcoal-700/15 bg-beige-50 px-4 py-2.5 text-sm text-charcoal-700 transition-colors focus:border-rust-400 focus:outline-none focus:ring-2 focus:ring-rust-400/20"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer rounded-full bg-charcoal-700 px-6 py-2.5 text-sm font-semibold text-beige-50 transition-colors hover:bg-rust-500 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

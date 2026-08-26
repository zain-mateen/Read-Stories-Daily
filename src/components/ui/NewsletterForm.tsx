"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";

export default function NewsletterForm({
  className = "",
}: {
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <div
        className={`flex items-center gap-2 rounded-full border border-beige-50/20 bg-beige-50/10 px-5 py-3 text-sm text-beige-100 ${className}`}
      >
        <CheckCircle size={18} weight="fill" className="text-rust-400" />
        You&apos;re subscribed — welcome aboard.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-sm items-center gap-2 rounded-full border border-beige-50/20 bg-beige-50/5 p-1.5 pl-4 ${className}`}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="min-w-0 flex-1 bg-transparent text-sm text-beige-50 placeholder:text-beige-200/50 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-rust-500 text-beige-50 transition-colors hover:bg-rust-400"
      >
        <PaperPlaneTilt size={16} weight="fill" />
      </button>
    </form>
  );
}

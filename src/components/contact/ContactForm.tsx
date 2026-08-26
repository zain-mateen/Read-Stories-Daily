"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";

const inputClasses =
  "w-full rounded-xl border border-charcoal-700/15 bg-beige-50 px-4 py-3 text-sm text-charcoal-700 placeholder:text-charcoal-300 transition-colors focus:border-rust-400 focus:outline-none focus:ring-2 focus:ring-rust-400/20";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-charcoal-700/10 bg-beige-100/60 px-6 py-16 text-center">
        <CheckCircle size={40} weight="fill" className="text-rust-500" />
        <h3 className="font-display text-xl font-semibold text-charcoal-800">
          Message sent
        </h3>
        <p className="max-w-sm text-sm text-charcoal-400">
          Thanks for reaching out — we typically reply within one to two
          business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-charcoal-600"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-charcoal-600"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium text-charcoal-600"
        >
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="What's this about?"
          className={inputClasses}
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-charcoal-600"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us a little more..."
          className={`${inputClasses} resize-none`}
        />
      </div>
      <Button type="submit" className="self-start">
        Send Message
        <PaperPlaneTilt size={16} weight="fill" />
      </Button>
    </form>
  );
}

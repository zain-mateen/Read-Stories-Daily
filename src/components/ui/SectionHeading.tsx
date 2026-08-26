import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  viewMoreHref,
  viewMoreLabel = "View all",
  icon: Icon,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  viewMoreHref?: string;
  viewMoreLabel?: string;
  icon?: Icon;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-xl">
        {eyebrow ? (
          <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rust-600">
            {Icon ? <Icon size={16} weight="bold" /> : null}
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-display text-2xl font-semibold text-charcoal-800 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-charcoal-400 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {viewMoreHref ? (
        <Link
          href={viewMoreHref}
          className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-charcoal-700 transition-colors hover:text-rust-600"
        >
          {viewMoreLabel}
          <ArrowRight
            size={16}
            weight="bold"
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      ) : null}
    </div>
  );
}

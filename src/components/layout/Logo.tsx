import Link from "next/link";

export default function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="Read Stories Daily home"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect
          width="34"
          height="34"
          rx="10"
          className={dark ? "fill-beige-50" : "fill-charcoal-700"}
        />
        <path
          d="M10 24V10.6c0-.44.36-.8.8-.8h6.4a4.6 4.6 0 0 1 2.9 8.17L23.4 24h-3.13l-3-5.4h-3.77V24H10Zm3.5-8.1h3.7a1.9 1.9 0 1 0 0-3.8h-3.7v3.8Z"
          className={dark ? "fill-charcoal-700" : "fill-beige-50"}
        />
      </svg>
      <span className="flex items-baseline gap-1.5 font-display leading-none">
        <span
          className={`text-lg font-semibold tracking-tight sm:text-xl ${
            dark ? "text-beige-50" : "text-charcoal-800"
          }`}
        >
          Read Stories
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
            dark
              ? "bg-beige-50/10 text-rust-400"
              : "bg-rust-500/10 text-rust-600"
          }`}
        >
          Daily
        </span>
      </span>
    </Link>
  );
}

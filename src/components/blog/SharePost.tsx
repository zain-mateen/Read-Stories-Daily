"use client";

import { useEffect, useRef, useState } from "react";

/** Brand marks (filled, 24×24) and UI glyphs (stroked) as inline SVG. */
const Icon = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-[18px] w-[18px]">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-[17px] w-[17px]">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.15 2.71 1.68 4.25 1.83v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  link: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[18px] w-[18px]"
    >
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <path d="M8 12h8" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[18px] w-[18px]"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  share: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[18px] w-[18px]"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  ),
};

const circleBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-700/15 text-charcoal-500 transition-colors duration-150 hover:border-transparent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-400/40";

/** Opens a centered popup window for a share intent URL. */
function openShareWindow(url: string) {
  const w = 600;
  const h = 540;
  const ref = window.top ?? window;
  const y = ref.outerHeight / 2 + ref.screenY - h / 2;
  const x = ref.outerWidth / 2 + ref.screenX - w / 2;
  const popup = window.open(
    url,
    "share",
    `noopener,noreferrer,width=${w},height=${h},top=${Math.max(0, y)},left=${Math.max(0, x)}`
  );
  // Popup blocked — fall back to a normal new tab.
  if (!popup) window.open(url, "_blank", "noopener,noreferrer");
}

export default function SharePost({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function flash(message: string) {
    setFeedback(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(null), 2600);
  }

  async function copyLink(): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const el = document.createElement("textarea");
        el.value = url;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      return true;
    } catch {
      return false;
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal-400">
          Share this story
        </p>
        <p
          aria-live="polite"
          className={`mt-0.5 h-4 text-xs text-rust-600 transition-opacity ${
            feedback ? "opacity-100" : "opacity-0"
          }`}
        >
          {feedback ?? " "}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          title="Share on Facebook"
          onClick={(e) => {
            e.preventDefault();
            openShareWindow(facebookUrl);
          }}
          className={`${circleBtn} hover:bg-[#1877F2]`}
        >
          {Icon.facebook}
        </a>

        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (Twitter)"
          title="Share on X (Twitter)"
          onClick={(e) => {
            e.preventDefault();
            openShareWindow(xUrl);
          }}
          className={`${circleBtn} hover:bg-black`}
        >
          {Icon.x}
        </a>

        <button
          type="button"
          aria-label="Copy link for TikTok"
          title="Copy link to share on TikTok"
          onClick={async () => {
            const ok = await copyLink();
            flash(
              ok
                ? "Link copied — paste it into your TikTok caption or bio."
                : "Couldn't copy the link automatically."
            );
          }}
          className={`${circleBtn} hover:bg-black`}
        >
          {Icon.tiktok}
        </button>

        <button
          type="button"
          aria-label={copied ? "Link copied" : "Copy link"}
          title="Copy link"
          onClick={async () => {
            const ok = await copyLink();
            if (ok) {
              setCopied(true);
              flash("Link copied to clipboard.");
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => {
                setCopied(false);
                setFeedback(null);
              }, 2600);
            } else {
              flash("Couldn't copy the link automatically.");
            }
          }}
          className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-400/40 ${
            copied
              ? "border-transparent bg-charcoal-700 text-white"
              : "border-charcoal-700/15 text-charcoal-500 hover:border-charcoal-700/30 hover:text-charcoal-700"
          }`}
        >
          {copied ? Icon.check : Icon.link}
          {copied ? "Copied" : "Copy link"}
        </button>

        {canNativeShare ? (
          <button
            type="button"
            aria-label="More sharing options"
            title="More sharing options"
            onClick={async () => {
              try {
                await navigator.share({ title, url });
              } catch {
                /* user dismissed the sheet — nothing to do */
              }
            }}
            className={`${circleBtn} hover:bg-rust-500`}
          >
            {Icon.share}
          </button>
        ) : null}
      </div>
    </div>
  );
}

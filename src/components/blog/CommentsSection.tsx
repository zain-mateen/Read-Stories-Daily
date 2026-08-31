"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ChatCircle, WarningCircle } from "@phosphor-icons/react";
import type { Comment } from "@/data/comments";

const NAME_MAX = 80;
const BODY_MAX = 4000;
const POLL_MS = 15_000;
const NAME_STORAGE_KEY = "rsd_comment_name";

const inputClasses =
  "w-full rounded-xl border border-charcoal-700/15 bg-beige-50 px-4 py-2.5 text-sm text-charcoal-700 placeholder:text-charcoal-300 transition-colors focus:border-rust-400 focus:outline-none focus:ring-2 focus:ring-rust-400/20";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

function absoluteDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * `relative` is only ever true after mount — computing "X mins ago" during SSR
 * would mismatch on hydration, so the server render always uses the date.
 */
function formatWhen(createdAt: string, relative: boolean): string {
  // Server sends "YYYY-MM-DD HH:MM:SS" — normalize to an ISO-ish local string.
  const date = new Date(createdAt.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return createdAt;
  if (!relative) return absoluteDate(date);

  const mins = Math.round((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return absoluteDate(date);
}

export default function CommentsSection({
  postSlug,
  initialComments,
}: {
  postSlug: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Restore the reader's last-used name.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_STORAGE_KEY);
      if (saved) setName(saved);
    } catch {
      /* storage unavailable — ignore */
    }
  }, []);

  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetch(
          `/api/posts/${encodeURIComponent(postSlug)}/comments`,
          { signal, cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as { comments?: Comment[] };
        if (Array.isArray(data.comments)) setComments(data.comments);
      } catch {
        /* offline or aborted — keep showing what we have */
      }
    },
    [postSlug]
  );

  // Poll for comments left by other readers, plus a refresh whenever the tab
  // regains focus. Polling pauses while the tab is hidden.
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer) return;
      timer = setInterval(() => refresh(controller.signal), POLL_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh(controller.signal);
        start();
      } else {
        stop();
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onVisibility);

    return () => {
      stop();
      controller.abort();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onVisibility);
    };
  }, [refresh]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!trimmedName || !trimmedBody) {
      setError("Add your name and a comment first.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/posts/${encodeURIComponent(postSlug)}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName, body: trimmedBody }),
        }
      );
      const data = (await res.json().catch(() => null)) as
        | { comment?: Comment; error?: string }
        | null;

      const created = data?.comment;
      if (!res.ok || !created) {
        setError(data?.error ?? "Couldn't post your comment. Please try again.");
        return;
      }

      setComments((prev) =>
        prev.some((c) => c.id === created.id) ? prev : [...prev, created]
      );
      setBody("");
      try {
        localStorage.setItem(NAME_STORAGE_KEY, trimmedName);
      } catch {
        /* ignore */
      }
      requestAnimationFrame(() =>
        listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="comments" aria-labelledby="comments-heading">
      <div className="flex items-center gap-2.5">
        <ChatCircle size={22} className="text-rust-500" weight="fill" />
        <h2
          id="comments-heading"
          className="font-display text-2xl font-semibold text-charcoal-800"
        >
          {comments.length === 0
            ? "Comments"
            : `${comments.length} Comment${comments.length === 1 ? "" : "s"}`}
        </h2>
      </div>

      {comments.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-6">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3.5">
              <span
                aria-hidden
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-700/8 text-sm font-semibold text-charcoal-500"
              >
                {initials(comment.authorName)}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-semibold text-charcoal-700">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-charcoal-300">
                    {formatWhen(comment.createdAt, mounted)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-charcoal-500">
                  {comment.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-charcoal-400">
          No comments yet — be the first to share your thoughts.
        </p>
      )}

      <div ref={listEndRef} />

      <form
        onSubmit={handleSubmit}
        className="mt-10 rounded-2xl border border-charcoal-700/10 bg-beige-100/60 p-5 sm:p-6"
      >
        <h3 className="font-display text-lg font-semibold text-charcoal-800">
          Leave a comment
        </h3>

        {error ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <WarningCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label
              htmlFor="comment-name"
              className="mb-1.5 block text-sm font-medium text-charcoal-600"
            >
              Name
            </label>
            <input
              id="comment-name"
              required
              maxLength={NAME_MAX}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="comment-body"
              className="mb-1.5 block text-sm font-medium text-charcoal-600"
            >
              Comment
            </label>
            <textarea
              id="comment-body"
              required
              rows={4}
              maxLength={BODY_MAX}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`${inputClasses} resize-y leading-relaxed`}
              placeholder="Share your thoughts…"
            />
            <p className="mt-1 text-right text-xs text-charcoal-300">
              {body.length}/{BODY_MAX}
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-fit cursor-pointer rounded-full bg-charcoal-700 px-6 py-2.5 text-sm font-semibold text-beige-50 transition-colors hover:bg-rust-500 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Posting…" : "Post Comment"}
          </button>
        </div>
      </form>
    </section>
  );
}

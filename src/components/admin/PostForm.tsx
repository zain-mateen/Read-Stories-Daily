"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { WarningCircle } from "@phosphor-icons/react";
import type { Post } from "@/data/posts";
import { serializePostContent } from "@/lib/postBlocks";
import { slugify } from "@/lib/slugify";

const inputClasses =
  "w-full rounded-xl border border-charcoal-700/15 bg-beige-50 px-4 py-2.5 text-sm text-charcoal-700 placeholder:text-charcoal-300 transition-colors focus:border-rust-400 focus:outline-none focus:ring-2 focus:ring-rust-400/20";
const labelClasses = "mb-1.5 block text-sm font-medium text-charcoal-600";

export default function PostForm({
  mode,
  post,
  categories,
}: {
  mode: "create" | "edit";
  post?: Post;
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [category, setCategory] = useState(post?.category ?? categories[0]?.slug ?? "");
  const [authorName, setAuthorName] = useState(post?.author.name ?? "");
  const [authorRole, setAuthorRole] = useState(post?.author.role ?? "");
  const [authorAvatar, setAuthorAvatar] = useState(post?.author.avatar ?? "");
  const [date, setDate] = useState(post?.date ?? new Date().toISOString().slice(0, 10));
  const [readTime, setReadTime] = useState(post?.readTime ?? "");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [image, setImage] = useState(post?.image ?? "");
  const [content, setContent] = useState(
    post ? serializePostContent(post.content) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      title,
      slug,
      excerpt,
      category,
      authorName,
      authorRole,
      authorAvatar,
      date,
      readTime,
      featured,
      image,
      content,
    };

    const url =
      mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${post?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Something went wrong. Please try again.");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <WarningCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClasses} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (mode === "create") setSlug(slugify(e.target.value));
            }}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={(e) => setSlug(slugify(e.target.value))}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="category">
            Category
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClasses} cursor-pointer`}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses} htmlFor="excerpt">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="authorName">
            Author name
          </label>
          <input
            id="authorName"
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="authorRole">
            Author role
          </label>
          <input
            id="authorRole"
            required
            placeholder="e.g. Travel Editor"
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses} htmlFor="authorAvatar">
            Author avatar URL
          </label>
          <input
            id="authorAvatar"
            required
            type="url"
            placeholder="https://..."
            value={authorAvatar}
            onChange={(e) => setAuthorAvatar(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="date">
            Publish date
          </label>
          <input
            id="date"
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClasses} cursor-pointer`}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="readTime">
            Read time
          </label>
          <input
            id="readTime"
            required
            placeholder="e.g. 6 min read"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses} htmlFor="image">
            Cover image URL
          </label>
          <input
            id="image"
            required
            type="url"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex items-center gap-2.5 sm:col-span-2">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-rust-500"
          />
          <label htmlFor="featured" className="cursor-pointer text-sm text-charcoal-600">
            Feature this post on the homepage hero
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses} htmlFor="content">
            Content
          </label>
          <p className="mb-2 text-xs leading-relaxed text-charcoal-400">
            Plain text. Separate paragraphs with a blank line. Start a line
            with <code className="rounded bg-charcoal-700/5 px-1">## </code>{" "}
            for a heading, or{" "}
            <code className="rounded bg-charcoal-700/5 px-1">&gt; </code> for
            a pull quote.
          </p>
          <textarea
            id="content"
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClasses} resize-y font-mono text-[13px] leading-relaxed`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer rounded-full bg-charcoal-700 px-6 py-2.5 text-sm font-semibold text-beige-50 transition-colors hover:bg-rust-500 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : mode === "create"
              ? "Create Post"
              : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="cursor-pointer rounded-full border border-charcoal-700/15 px-6 py-2.5 text-sm font-medium text-charcoal-600 transition-colors hover:border-charcoal-700/30"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

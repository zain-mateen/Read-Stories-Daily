"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, UploadSimple, WarningCircle, X } from "@phosphor-icons/react";
import type { Post } from "@/data/posts";
import { serializePostContent } from "@/lib/postBlocks";
import { slugify } from "@/lib/slugify";

const inputClasses =
  "w-full rounded-xl border border-charcoal-700/15 bg-beige-50 px-4 py-2.5 text-sm text-charcoal-700 placeholder:text-charcoal-300 transition-colors focus:border-rust-400 focus:outline-none focus:ring-2 focus:ring-rust-400/20";
const labelClasses = "mb-1.5 block text-sm font-medium text-charcoal-600";

type CategoryOption = { slug: string; name: string };

/** Uploads an image to /api/admin/images and returns its served URL. */
function ImageUploadField({
  label,
  value,
  onChange,
  onError,
  onUploadingChange,
  circle = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
  onUploadingChange: (uploading: boolean) => void;
  circle?: boolean;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    onError("");
    setUploading(true);
    onUploadingChange(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/images", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        onError(data?.error ?? "Image upload failed.");
        return;
      }
      onChange(data.url as string);
    } finally {
      setUploading(false);
      onUploadingChange(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const previewShape = circle
    ? "h-20 w-20 rounded-full"
    : "h-28 w-44 rounded-xl";

  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={`${label} preview`}
            className={`${previewShape} shrink-0 border border-charcoal-700/15 object-cover`}
          />
        ) : (
          <div
            className={`${previewShape} flex shrink-0 items-center justify-center border border-dashed border-charcoal-700/25 text-center text-[11px] text-charcoal-300`}
          >
            No image
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-charcoal-700/15 px-4 py-2 text-sm font-medium text-charcoal-600 transition-colors hover:border-rust-400 hover:text-rust-600 disabled:cursor-wait disabled:opacity-60"
          >
            <UploadSimple size={15} />
            {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-fit cursor-pointer text-xs text-charcoal-400 hover:text-rust-600"
            >
              Remove
            </button>
          ) : null}
          <p className="text-xs text-charcoal-300">
            {hint ?? "PNG, JPEG, WebP, or GIF. Up to 5 MB."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PostForm({
  mode,
  post,
  categories: initialCategories,
}: {
  mode: "create" | "edit";
  post?: Post;
  categories: CategoryOption[];
}) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryOption[]>(initialCategories);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  // Kept but no longer editable in the UI — preserved so editing a post that
  // already has a search description doesn't wipe it. Blank = auto-generated
  // from the story content.
  const [excerpt] = useState(post?.excerpt ?? "");
  const [category, setCategory] = useState(
    post?.category ?? initialCategories[0]?.slug ?? ""
  );
  const [authorName, setAuthorName] = useState(post?.author.name ?? "");
  const [authorRole, setAuthorRole] = useState(post?.author.role ?? "");
  const [authorAvatar, setAuthorAvatar] = useState(post?.author.avatar ?? "");
  const [date, setDate] = useState(
    post?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [readTime, setReadTime] = useState(post?.readTime ?? "");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [image, setImage] = useState(post?.image ?? "");
  const [blogNumber, setBlogNumber] = useState(
    post?.blogNumber != null ? String(post.blogNumber) : ""
  );
  const [content, setContent] = useState(
    post ? serializePostContent(post.content) : ""
  );

  const [coverUploading, setCoverUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    setError(null);
    setAddingCategory(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Could not create the category.");
        return;
      }
      const created = data.category as { slug: string; name: string };
      setCategories((prev) =>
        prev.some((c) => c.slug === created.slug)
          ? prev
          : [...prev, { slug: created.slug, name: created.name }]
      );
      setCategory(created.slug);
      setNewCategoryName("");
      setNewCategoryOpen(false);
    } finally {
      setAddingCategory(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!image) {
      setError("Upload a cover image first.");
      return;
    }
    if (!authorAvatar) {
      setError("Upload an author avatar first.");
      return;
    }
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
      blogNumber: blogNumber.trim(),
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
            maxLength={1000}
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
          <div className="mb-1.5 flex items-center justify-between">
            <label className={`${labelClasses} mb-0`} htmlFor="category">
              Category
            </label>
            <button
              type="button"
              onClick={() => setNewCategoryOpen((v) => !v)}
              className="flex cursor-pointer items-center gap-1 text-xs font-medium text-rust-600 hover:text-rust-500"
            >
              {newCategoryOpen ? <X size={12} /> : <Plus size={12} />}
              {newCategoryOpen ? "Cancel" : "New category"}
            </button>
          </div>
          {newCategoryOpen ? (
            <div className="flex gap-2">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. War Stories"
                className={inputClasses}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={addingCategory || !newCategoryName.trim()}
                className="shrink-0 cursor-pointer rounded-xl bg-charcoal-700 px-4 text-sm font-semibold text-beige-50 transition-colors hover:bg-rust-500 disabled:cursor-wait disabled:opacity-60"
              >
                {addingCategory ? "Adding..." : "Add"}
              </button>
            </div>
          ) : (
            <select
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClasses} cursor-pointer`}
            >
              {categories.length === 0 ? (
                <option value="" disabled>
                  No categories yet
                </option>
              ) : null}
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
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
            placeholder="e.g. Contributor"
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
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

        <div>
          <label className={labelClasses} htmlFor="blogNumber">
            Blog number{" "}
            <span className="font-normal text-charcoal-300">
              (optional, unique)
            </span>
          </label>
          <input
            id="blogNumber"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 460"
            value={blogNumber}
            onChange={(e) => setBlogNumber(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex items-center gap-2.5">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-rust-500"
          />
          <label
            htmlFor="featured"
            className="cursor-pointer text-sm text-charcoal-600"
          >
            Feature on the homepage hero
          </label>
        </div>

        <div className="sm:col-span-2">
          <ImageUploadField
            label="Cover image"
            value={image}
            onChange={setImage}
            onError={(m) => setError(m || null)}
            onUploadingChange={setCoverUploading}
          />
        </div>

        <div className="sm:col-span-2">
          <ImageUploadField
            label="Author avatar"
            value={authorAvatar}
            onChange={setAuthorAvatar}
            onError={(m) => setError(m || null)}
            onUploadingChange={setAvatarUploading}
            circle
            hint="A square image works best. Up to 5 MB."
          />
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
          disabled={submitting || coverUploading || avatarUploading}
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

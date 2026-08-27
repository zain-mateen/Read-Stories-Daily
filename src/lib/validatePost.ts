import { categories } from "@/data/categories";
import type { PostInput } from "@/data/posts";
import { parsePostContent } from "./postBlocks";
import { slugify } from "./slugify";

type ValidationResult = { input: PostInput } | { error: string };

/** Validates and normalizes a post form submission from the admin panel. */
export function validatePostPayload(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;
  const str = (key: string) => (typeof b[key] === "string" ? (b[key] as string).trim() : "");

  const title = str("title");
  const excerpt = str("excerpt");
  const category = str("category");
  const authorName = str("authorName");
  const authorRole = str("authorRole");
  const authorAvatar = str("authorAvatar");
  const date = str("date");
  const readTime = str("readTime");
  const image = str("image");
  const contentRaw = typeof b.content === "string" ? b.content : "";
  const featured = Boolean(b.featured);
  const slug = slugify(str("slug") || title);

  if (!title) return { error: "Title is required." };
  if (!slug) return { error: "Couldn't derive a slug — check the title." };
  if (!excerpt) return { error: "Excerpt is required." };
  if (!categories.some((c) => c.slug === category)) {
    return { error: "Choose a valid category." };
  }
  if (!authorName) return { error: "Author name is required." };
  if (!authorRole) return { error: "Author role is required." };
  if (!authorAvatar) return { error: "Author avatar URL is required." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Date must be in YYYY-MM-DD format." };
  }
  if (!readTime) return { error: "Read time is required." };
  if (!image) return { error: "Cover image URL is required." };

  const content = parsePostContent(contentRaw);
  if (content.length === 0) return { error: "Content can't be empty." };

  return {
    input: {
      slug,
      title,
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
    },
  };
}

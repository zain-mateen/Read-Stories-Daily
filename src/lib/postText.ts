import type { Post, PostBlock } from "@/data/posts";

/** The text of the first paragraph block, or the first block of any kind. */
function firstProse(content: PostBlock[]): string {
  const para = content.find((b) => b.type === "paragraph");
  return (para ?? content[0])?.text ?? "";
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/**
 * Short preview text for blog cards — the manually written search
 * description if there is one, otherwise the opening of the article.
 */
export function postPreview(post: Post): string {
  const manual = post.excerpt?.trim();
  if (manual) return manual;
  return truncate(firstProse(post.content), 160);
}

/**
 * Meta description for `<head>` / Open Graph — same idea as `postPreview`
 * but a touch longer, and always a plain string.
 */
export function postSummary(post: Post): string {
  const manual = post.excerpt?.trim();
  if (manual) return manual;
  return truncate(firstProse(post.content), 200);
}

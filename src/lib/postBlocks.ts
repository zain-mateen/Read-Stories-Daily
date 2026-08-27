import type { PostBlock } from "@/data/posts";

/**
 * The admin panel's content field is a single plain-text box using a tiny,
 * human-friendly convention instead of a full rich-text editor:
 *
 *   ## A heading           -> { type: "heading" }
 *   > A pull quote         -> { type: "quote" }
 *   Anything else          -> { type: "paragraph" }
 *
 * Blocks are separated by a blank line. This mirrors the PostBlock union
 * already rendered on the post page, so no rendering changes were needed.
 */
export function parsePostContent(raw: string): PostBlock[] {
  return raw
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): PostBlock => {
      const normalize = (text: string) => text.replace(/\s*\n\s*/g, " ").trim();

      if (chunk.startsWith("## ")) {
        return { type: "heading", text: normalize(chunk.slice(3)) };
      }
      if (chunk.startsWith("> ")) {
        return { type: "quote", text: normalize(chunk.slice(2)) };
      }
      return { type: "paragraph", text: normalize(chunk) };
    });
}

/** The inverse of parsePostContent — used to pre-fill the edit form. */
export function serializePostContent(blocks: PostBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "heading") return `## ${block.text}`;
      if (block.type === "quote") return `> ${block.text}`;
      return block.text;
    })
    .join("\n\n");
}

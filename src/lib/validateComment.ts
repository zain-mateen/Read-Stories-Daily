export const COMMENT_NAME_MAX = 80;
export const COMMENT_BODY_MAX = 4000;

type ValidationResult = { name: string; body: string } | { error: string };

/** Validates and normalizes a comment submission from the blog post page. */
export function validateCommentPayload(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;

  const name = (typeof b.name === "string" ? b.name : "")
    .trim()
    .replace(/\s+/g, " ");
  const text = (typeof b.body === "string" ? b.body : "").trim();

  if (!name) return { error: "Please add your name." };
  if (name.length > COMMENT_NAME_MAX) {
    return { error: `Name must be ${COMMENT_NAME_MAX} characters or fewer.` };
  }
  if (!text) return { error: "Please write a comment." };
  if (text.length > COMMENT_BODY_MAX) {
    return { error: `Comment must be ${COMMENT_BODY_MAX} characters or fewer.` };
  }

  return { name, body: text };
}

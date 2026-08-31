import { query, execute, readQuery } from "@/lib/db";

export type Comment = {
  id: number;
  postId: number;
  authorName: string;
  body: string;
  /** "YYYY-MM-DD HH:MM:SS" (server time — `dateStrings` is on for the pool). */
  createdAt: string;
};

/** A comment plus the post it belongs to — used by the admin moderation view. */
export type CommentWithPost = Comment & {
  postSlug: string;
  postTitle: string;
};

type CommentRow = {
  id: number;
  post_id: number;
  author_name: string;
  body: string;
  created_at: string;
};

function mapRow(row: CommentRow): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
  };
}

// ---- Public reads/writes (used by the blog post page) -------------------

/** Oldest first, so new comments read as appended to the bottom of the thread. */
export async function getCommentsForPost(postId: number): Promise<Comment[]> {
  const rows = await readQuery<CommentRow>(
    [],
    "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC, id ASC",
    [postId]
  );
  return rows.map(mapRow);
}

export async function createComment(
  postId: number,
  authorName: string,
  body: string
): Promise<Comment> {
  const result = await execute(
    "INSERT INTO comments (post_id, author_name, body) VALUES (?, ?, ?)",
    [postId, authorName, body]
  );
  const rows = await query<CommentRow>(
    "SELECT * FROM comments WHERE id = ? LIMIT 1",
    [result.insertId]
  );
  return mapRow(rows[0]);
}

// ---- Admin reads/writes (used by /admin/comments) -----------------------

export async function getAllComments(): Promise<CommentWithPost[]> {
  const rows = await readQuery<
    CommentRow & { post_slug: string; post_title: string }
  >(
    [],
    `SELECT cm.*, p.slug AS post_slug, p.title AS post_title
       FROM comments cm
       JOIN posts p ON p.id = cm.post_id
      ORDER BY cm.created_at DESC, cm.id DESC`
  );
  return rows.map((row) => ({
    ...mapRow(row),
    postSlug: row.post_slug,
    postTitle: row.post_title,
  }));
}

export async function getCommentById(id: number): Promise<Comment | undefined> {
  const rows = await readQuery<CommentRow>(
    [],
    "SELECT * FROM comments WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapRow(rows[0]) : undefined;
}

export async function deleteComment(id: number): Promise<void> {
  await execute("DELETE FROM comments WHERE id = ?", [id]);
}

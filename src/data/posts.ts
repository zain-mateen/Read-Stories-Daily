import { query, execute } from "@/lib/db";

export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string };

export type Author = {
  name: string;
  role: string;
  avatar: string;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: Author;
  date: string;
  readTime: string;
  featured: boolean;
  image: string;
  content: PostBlock[];
};

/** Shape used when creating or updating a post from the admin panel. */
export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  date: string; // "YYYY-MM-DD"
  readTime: string;
  featured: boolean;
  image: string;
  content: PostBlock[];
};

type PostRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  published_date: string;
  read_time: string;
  featured: number;
  image: string;
  content: string;
};

function mapRow(row: PostRow): Post {
  let content: PostBlock[] = [];
  try {
    content = JSON.parse(row.content);
  } catch {
    content = [];
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    author: {
      name: row.author_name,
      role: row.author_role,
      avatar: row.author_avatar,
    },
    date: row.published_date,
    readTime: row.read_time,
    featured: !!row.featured,
    image: row.image,
    content,
  };
}

const ORDER = "ORDER BY published_date DESC, id DESC";

// ---- Public reads (used throughout the site) ----------------------------

export async function getAllPosts(): Promise<Post[]> {
  const rows = await query<PostRow>(`SELECT * FROM posts ${ORDER}`);
  return rows.map(mapRow);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const rows = await query<PostRow>(
    "SELECT * FROM posts WHERE slug = ? LIMIT 1",
    [slug]
  );
  return rows[0] ? mapRow(rows[0]) : undefined;
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const rows = await query<PostRow>(
    `SELECT * FROM posts WHERE category = ? ${ORDER}`,
    [categorySlug]
  );
  return rows.map(mapRow);
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  const featured = await query<PostRow>(
    `SELECT * FROM posts WHERE featured = 1 ${ORDER} LIMIT 1`
  );
  if (featured[0]) return mapRow(featured[0]);

  const mostRecent = await query<PostRow>(`SELECT * FROM posts ${ORDER} LIMIT 1`);
  return mostRecent[0] ? mapRow(mostRecent[0]) : undefined;
}

export async function getRecentPosts(
  limit: number,
  excludeSlug?: string
): Promise<Post[]> {
  const rows = excludeSlug
    ? await query<PostRow>(
        `SELECT * FROM posts WHERE slug != ? ${ORDER} LIMIT ?`,
        [excludeSlug, limit]
      )
    : await query<PostRow>(`SELECT * FROM posts ${ORDER} LIMIT ?`, [limit]);
  return rows.map(mapRow);
}

export async function getRelatedPosts(post: Post, limit: number): Promise<Post[]> {
  const rows = await query<PostRow>(
    `SELECT * FROM posts WHERE category = ? AND slug != ? ${ORDER} LIMIT ?`,
    [post.category, post.slug, limit]
  );
  return rows.map(mapRow);
}

// ---- Admin reads/writes (used by /admin) ---------------------------------

export async function getPostById(id: number): Promise<Post | undefined> {
  const rows = await query<PostRow>("SELECT * FROM posts WHERE id = ? LIMIT 1", [
    id,
  ]);
  return rows[0] ? mapRow(rows[0]) : undefined;
}

export async function isSlugTaken(slug: string, excludeId?: number): Promise<boolean> {
  const rows = excludeId
    ? await query<{ id: number }>(
        "SELECT id FROM posts WHERE slug = ? AND id != ? LIMIT 1",
        [slug, excludeId]
      )
    : await query<{ id: number }>("SELECT id FROM posts WHERE slug = ? LIMIT 1", [
        slug,
      ]);
  return rows.length > 0;
}

export async function createPost(input: PostInput): Promise<number> {
  const result = await execute(
    `INSERT INTO posts
      (slug, title, excerpt, category, author_name, author_role, author_avatar,
       published_date, read_time, featured, image, content)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.slug,
      input.title,
      input.excerpt,
      input.category,
      input.authorName,
      input.authorRole,
      input.authorAvatar,
      input.date,
      input.readTime,
      input.featured ? 1 : 0,
      input.image,
      JSON.stringify(input.content),
    ]
  );
  return result.insertId;
}

export async function updatePost(id: number, input: PostInput): Promise<void> {
  await execute(
    `UPDATE posts SET
      slug = ?, title = ?, excerpt = ?, category = ?,
      author_name = ?, author_role = ?, author_avatar = ?,
      published_date = ?, read_time = ?, featured = ?, image = ?, content = ?
     WHERE id = ?`,
    [
      input.slug,
      input.title,
      input.excerpt,
      input.category,
      input.authorName,
      input.authorRole,
      input.authorAvatar,
      input.date,
      input.readTime,
      input.featured ? 1 : 0,
      input.image,
      JSON.stringify(input.content),
      id,
    ]
  );
}

export async function deletePost(id: number): Promise<void> {
  await execute("DELETE FROM posts WHERE id = ?", [id]);
}

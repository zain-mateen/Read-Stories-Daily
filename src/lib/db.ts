import net from "net";
import mysql from "mysql2/promise";

declare global {
  var __rsdPool: mysql.Pool | undefined;
  var __rsdSchema: Promise<void> | undefined;
}

// Node's "Happy Eyeballs" dual-stack connect can throw an uncatchable
// `new AggregateError(null)` (a Node bug) when a host resolves to both IPv6
// and IPv4 and the connection fails — which would crash the whole server
// whenever the database is briefly unreachable. Turning it off avoids that
// path; a single-address connect fails cleanly and is caught normally.
try {
  net.setDefaultAutoSelectFamily?.(false);
} catch {
  /* older Node — ignore */
}

function resolveHost(): string | undefined {
  const host = process.env.DB_HOST;
  // "localhost" is the dual-stack case above; 127.0.0.1 is single-address.
  return host === "localhost" ? "127.0.0.1" : host;
}

/**
 * A lazily-created, process-wide connection pool.
 *
 * `mysql2` pools don't open a real connection until the first query runs,
 * so importing this module (including at `next build` time, for routes
 * that aren't force-dynamic) never touches the network. Cached on
 * `globalThis` so hot-reload in dev doesn't leak a new pool per edit.
 */
function getPool(): mysql.Pool {
  if (!global.__rsdPool) {
    global.__rsdPool = mysql.createPool({
      host: resolveHost(),
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      connectTimeout: 10000,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 5,
      idleTimeout: 60000,
      queueLimit: 0,
      dateStrings: true,
    });
  }
  return global.__rsdPool;
}

const SEED_CATEGORIES: ReadonlyArray<
  [slug: string, name: string, description: string, order: number, primary: 0 | 1]
> = [
  ["true-stories", "True Stories", "Real events, real people — accounts of things that actually happened.", 1, 1],
  ["mystery-suspense", "Mystery & Suspense", "Puzzles, disappearances, and slow-burn tension that keeps you guessing.", 2, 1],
  ["horror-stories", "Horror Stories", "Tales meant to unsettle — the dark, the eerie, and the genuinely frightening.", 3, 1],
  ["emotional-stories", "Emotional Stories", "Stories that hit close to home and stay with you after the last line.", 10, 0],
  ["inspirational-stories", "Inspirational Stories", "Ordinary people, hard odds, and the choices that changed everything.", 11, 0],
  ["love-stories", "Love Stories", "Romance in all its forms — the beginnings, the endings, and everything between.", 12, 0],
  ["animal-stories", "Animal Stories", "Loyalty, rescue, and the bonds between people and the animals they love.", 13, 0],
  ["strange-unbelievable", "Strange & Unbelievable", "The bizarre and the barely-credible — stories that sound made up but aren't.", 14, 0],
];

/**
 * Creates/updates the schema the app needs, on first DB use. Runs once per
 * process (guarded on `globalThis`). Every statement is `IF NOT EXISTS` /
 * `INSERT IGNORE` / guarded, so it's safe to run on every cold start, and a
 * failure here is logged but never blocks a request (the tables may already
 * exist from a manual migration).
 */
async function runEnsureSchema(pool: mysql.Pool): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(1000) NOT NULL,
        excerpt TEXT NOT NULL,
        category VARCHAR(80) NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        author_role VARCHAR(255) NOT NULL,
        author_avatar VARCHAR(500) NOT NULL,
        published_date DATE NOT NULL,
        read_time VARCHAR(50) NOT NULL,
        featured TINYINT(1) NOT NULL DEFAULT 0,
        image VARCHAR(500) NOT NULL,
        content LONGTEXT NOT NULL,
        blog_number INT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_published_date (published_date),
        UNIQUE KEY uq_blog_number (blog_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(80) NOT NULL UNIQUE,
        name VARCHAR(120) NOT NULL,
        description VARCHAR(500) NOT NULL DEFAULT '',
        sort_order INT NOT NULL DEFAULT 100,
        in_primary_nav TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(
      `INSERT IGNORE INTO categories (slug, name, description, sort_order, in_primary_nav) VALUES ${SEED_CATEGORIES.map(
        () => "(?, ?, ?, ?, ?)"
      ).join(", ")}`,
      SEED_CATEGORIES.flat()
    );

    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_images (
        id CHAR(32) PRIMARY KEY,
        mime VARCHAR(64) NOT NULL,
        byte_size INT NOT NULL,
        data LONGBLOB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Reader comments on a post. Deleting a post removes its comments.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        author_name VARCHAR(80) NOT NULL,
        body VARCHAR(4000) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_post_created (post_id, created_at),
        CONSTRAINT fk_comments_post FOREIGN KEY (post_id)
          REFERENCES posts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // `posts` may predate blog_number — MySQL has no ADD COLUMN IF NOT EXISTS.
    const [cols] = await pool.query(
      `SELECT 1 FROM information_schema.columns
        WHERE table_schema = DATABASE() AND table_name = 'posts'
          AND column_name = 'blog_number' LIMIT 1`
    );
    if ((cols as unknown[]).length === 0) {
      await pool.query(
        `ALTER TABLE posts ADD COLUMN blog_number INT NULL,
           ADD UNIQUE KEY uq_blog_number (blog_number)`
      );
    }

    // `posts.title` was originally VARCHAR(255) — widen it in place.
    const [titleCol] = await pool.query(
      `SELECT character_maximum_length AS len FROM information_schema.columns
        WHERE table_schema = DATABASE() AND table_name = 'posts'
          AND column_name = 'title' LIMIT 1`
    );
    if (((titleCol as { len: number }[])[0]?.len ?? 0) < 1000) {
      await pool.query(`ALTER TABLE posts MODIFY title VARCHAR(1000) NOT NULL`);
    }
  } catch (err) {
    // Logged once per process, as a warning so it doesn't trip the dev
    // error overlay. The tables may already exist from a previous deploy;
    // individual queries still run and their callers handle failure.
    console.warn(
      "[rsd] ensureSchema skipped (database not reachable):",
      err instanceof Error ? err.message : err
    );
  }
}

function ensureSchema(): Promise<void> {
  if (!global.__rsdSchema) {
    global.__rsdSchema = runEnsureSchema(getPool());
  }
  return global.__rsdSchema;
}

/**
 * Run a parameterized query and get back just the rows.
 * Always use `?` placeholders + a params array — never string-concatenate
 * user input into `sql`.
 */
export async function query<T = unknown>(
  sql: string,
  params: ReadonlyArray<unknown> = []
): Promise<T[]> {
  await ensureSchema();
  const pool = getPool();
  const [rows] = await pool.query(sql, params as unknown[]);
  return rows as T[];
}

/** Run a single INSERT/UPDATE/DELETE and get back the result metadata. */
export async function execute(
  sql: string,
  params: ReadonlyArray<unknown> = []
): Promise<mysql.ResultSetHeader> {
  await ensureSchema();
  const pool = getPool();
  const [result] = await pool.query(sql, params as unknown[]);
  return result as mysql.ResultSetHeader;
}

const IS_DEV = process.env.NODE_ENV === "development";
let warnedNoDb = false;

/**
 * Runs a read query. If it fails **and we're in local dev** (typically: no
 * database running on your machine), returns `fallback` so pages render an
 * empty state instead of a 500. In production the error propagates so real
 * outages stay visible.
 */
export async function readQuery<T>(
  fallback: T[],
  sql: string,
  params: ReadonlyArray<unknown> = []
): Promise<T[]> {
  try {
    return await query<T>(sql, params);
  } catch (err) {
    if (IS_DEV) {
      if (!warnedNoDb) {
        warnedNoDb = true;
        console.warn(
          "[rsd] Database not reachable — rendering empty content for local dev. " +
            "Set DB_* in .env.local to connect one."
        );
      }
      return fallback;
    }
    throw err;
  }
}

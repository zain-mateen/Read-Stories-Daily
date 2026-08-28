/**
 * The canonical production origin, with no trailing slash.
 *
 * Set NEXT_PUBLIC_SITE_URL in the environment (cPanel → Setup Node.js App,
 * and in .env.local before `next build` since it's inlined at build time).
 * The fallback is the real production domain so metadata/sitemap/robots
 * still resolve correctly if the variable is ever missing.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://readstoriesdaily.com"
).replace(/\/+$/, "");

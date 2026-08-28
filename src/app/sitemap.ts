import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { getAllPosts } from "@/data/posts";
import { categories } from "@/data/categories";

// Posts are database-backed and change without a redeploy, so the sitemap
// is generated per request rather than baked in at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/search`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    postRoutes = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Database unreachable at request time — still return the static
    // routes rather than failing the whole sitemap.
  }

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import { getAllCategories, getCategoryBySlug } from "@/data/categories";
import { getPostsByCategory } from "@/data/posts";

// Posts are managed live through /admin (database-backed), so this route
// always renders fresh rather than being pre-generated at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/category/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description || `Stories in ${category.name}.`,
  };
}

export default async function CategoryPage(
  props: PageProps<"/category/[slug]">
) {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [posts, allCategories] = await Promise.all([
    getPostsByCategory(slug),
    getAllCategories(),
  ]);

  return (
    <>
      <section className="relative flex min-h-[240px] items-end overflow-hidden border-b border-charcoal-700/10 bg-charcoal-800 sm:min-h-[280px]">
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-800" />
        <div className="absolute inset-0 bg-gradient-to-r from-rust-600/20 via-transparent to-transparent" />

        <Container className="relative w-full py-10 sm:py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-rust-400">
            Category
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-beige-50 sm:text-4xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-beige-100/85">
              {category.description}
            </p>
          ) : null}
        </Container>
      </section>

      <Container>
        <div className="flex flex-wrap items-center gap-2.5 pt-10 sm:pt-12">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-charcoal-300">
            Browse:
          </span>
          {allCategories.map((c) => (
            <a
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                c.slug === category.slug
                  ? "bg-charcoal-700 text-beige-50"
                  : "border border-charcoal-700/15 bg-beige-50 text-charcoal-600 hover:border-rust-400 hover:text-rust-600"
              }`}
            >
              {c.name}
            </a>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-charcoal-400">
            No stories in this category just yet — check back soon.
          </p>
        )}
      </Container>
    </>
  );
}

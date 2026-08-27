import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getPostsByCategory } from "@/data/posts";

// Posts are managed live through /admin (database-backed), so this route
// always renders fresh rather than being pre-generated at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/category/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage(
  props: PageProps<"/category/[slug]">
) {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getPostsByCategory(slug);
  const Icon = category.icon;

  return (
    <>
      <section className="relative flex min-h-[280px] items-end overflow-hidden border-b border-charcoal-700/10 sm:min-h-[320px]">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/55 to-charcoal-900/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/55 via-charcoal-900/10 to-transparent" />

        <Container className="relative w-full py-10 sm:py-12">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-beige-50/15 text-beige-50 backdrop-blur-sm">
              <Icon size={26} weight="light" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-rust-400">
                Category
              </span>
              <h1 className="font-display text-3xl font-semibold text-beige-50 sm:text-4xl">
                {category.name}
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-beige-100/85">
            {category.description}
          </p>
        </Container>
      </section>

      <Container>
        <div className="flex flex-wrap items-center gap-2.5 pt-10 sm:pt-12">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-charcoal-300">
            Browse:
          </span>
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                c.slug === category.slug
                  ? "bg-charcoal-700 text-beige-50"
                  : "border border-charcoal-700/15 bg-beige-50 text-charcoal-600 hover:border-rust-400 hover:text-rust-600"
              }`}
            >
              <c.icon size={14} />
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

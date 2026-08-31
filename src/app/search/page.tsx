import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PostFilterGrid from "@/components/blog/PostFilterGrid";
import { getAllPosts } from "@/data/posts";
import { getAllCategories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Search",
  description: "Search stories across Read Stories Daily.",
};

// Posts are managed live through /admin (database-backed).
export const dynamic = "force-dynamic";

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams;
  const raw = params.q;
  const query = typeof raw === "string" ? raw : (raw?.[0] ?? "");
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  return (
    <>
      <section className="border-b border-charcoal-700/10 bg-beige-100/50 py-14 sm:py-16">
        <Container>
          <span className="text-xs font-semibold uppercase tracking-widest text-rust-600">
            Search
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-charcoal-800 sm:text-4xl">
            Find your next read.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal-400">
            Search by title, author, or blog number, and narrow it down by
            category.
          </p>
        </Container>
      </section>

      <Container>
        <div className="py-14 sm:py-16">
          <PostFilterGrid
            posts={posts}
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            showSearch
            initialQuery={query}
          />
        </div>
      </Container>
    </>
  );
}

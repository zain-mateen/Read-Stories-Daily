import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PostFilterGrid from "@/components/blog/PostFilterGrid";
import { getAllPosts } from "@/data/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All stories from Read Stories Daily — travel, lifestyle, culture, and wellness.",
};

// Posts are managed live through /admin (database-backed), so this page
// always renders fresh rather than being baked in at build time.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="border-b border-charcoal-700/10 bg-beige-100/50 py-14 sm:py-16">
        <Container>
          <span className="text-xs font-semibold uppercase tracking-widest text-rust-600">
            The Blog
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-charcoal-800 sm:text-4xl">
            Every story, in one place.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal-400">
            Search the archive, or filter by the topics you&apos;re in the
            mood for.
          </p>
        </Container>
      </section>

      <Container>
        <div className="py-14 sm:py-16">
          <PostFilterGrid posts={posts} showSearch />
        </div>
      </Container>
    </>
  );
}

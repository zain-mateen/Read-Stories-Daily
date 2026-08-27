import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Hero from "@/components/blog/Hero";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogCard from "@/components/blog/BlogCard";
import CategorySection from "@/components/blog/CategorySection";
import { getFeaturedPost, getRecentPosts } from "@/data/posts";
import { categories } from "@/data/categories";

// Posts are managed live through /admin (database-backed), so this page
// always renders fresh rather than being baked in at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await getFeaturedPost();
  const recent = await getRecentPosts(3, featured?.slug);

  return (
    <>
      <Hero />

      <Container>
        {featured ? (
          <>
            <section className="py-14 sm:py-16">
              <FeaturedPost post={featured} />
            </section>

            <div className="h-px w-full bg-charcoal-700/10" />
          </>
        ) : null}

        {recent.length > 0 ? (
          <>
            <section className="py-14 sm:py-16">
              <SectionHeading
                eyebrow="Fresh off the press"
                title="Latest Stories"
                description="The newest reads from across the blog, updated regularly."
                viewMoreHref="/blog"
                viewMoreLabel="View all posts"
              />
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </section>

            <div className="h-px w-full bg-charcoal-700/10" />
          </>
        ) : null}

        {categories.map((category, index) => (
          <div key={category.slug}>
            <CategorySection categorySlug={category.slug} />
            {index < categories.length - 1 ? (
              <div className="h-px w-full bg-charcoal-700/10" />
            ) : null}
          </div>
        ))}
      </Container>
    </>
  );
}

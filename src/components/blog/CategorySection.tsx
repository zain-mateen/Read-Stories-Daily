import { getCategoryBySlug } from "@/data/categories";
import { getPostsByCategory } from "@/data/posts";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCard from "./BlogCard";

export default async function CategorySection({
  categorySlug,
  limit = 3,
}: {
  categorySlug: string;
  limit?: number;
}) {
  const category = getCategoryBySlug(categorySlug);
  const allPosts = await getPostsByCategory(categorySlug);
  const posts = allPosts.slice(0, limit);

  if (!category || posts.length === 0) return null;

  return (
    <section className="py-14 sm:py-16">
      <SectionHeading
        eyebrow={category.name}
        icon={category.icon}
        title={category.description}
        viewMoreHref={`/category/${category.slug}`}
        viewMoreLabel={`All ${category.name}`}
      />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

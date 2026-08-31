import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getNavCategories } from "@/data/categories";
import { getPostById } from "@/data/posts";

export const dynamic = "force-dynamic";

export default async function EditPostPage(
  props: PageProps<"/admin/posts/[id]/edit">
) {
  const { id } = await props.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const [post, categories] = await Promise.all([
    getPostById(numericId),
    getNavCategories(),
  ]);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-800">
        Edit Post
      </h1>
      <div className="mt-6 max-w-3xl">
        <PostForm
          mode="edit"
          post={post}
          categories={categories.map(({ slug, name }) => ({ slug, name }))}
        />
      </div>
    </div>
  );
}

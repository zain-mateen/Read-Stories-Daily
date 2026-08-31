import PostForm from "@/components/admin/PostForm";
import { getNavCategories } from "@/data/categories";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const categories = (await getNavCategories()).map(({ slug, name }) => ({
    slug,
    name,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-800">
        New Post
      </h1>
      <div className="mt-6 max-w-3xl">
        <PostForm mode="create" categories={categories} />
      </div>
    </div>
  );
}

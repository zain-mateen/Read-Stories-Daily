import PostForm from "@/components/admin/PostForm";
import { categories } from "@/data/categories";

// Only pass plain, serializable fields to the Client Component — the
// full Category objects carry a React icon component, which can't cross
// the server/client boundary as a prop.
const categoryOptions = categories.map(({ slug, name }) => ({ slug, name }));

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-800">
        New Post
      </h1>
      <div className="mt-6 max-w-3xl">
        <PostForm mode="create" categories={categoryOptions} />
      </div>
    </div>
  );
}

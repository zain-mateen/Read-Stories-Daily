import Link from "next/link";
import { PencilSimple, Plus, Star } from "@phosphor-icons/react/ssr";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { getAllPosts } from "@/data/posts";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-800">
            Posts
          </h1>
          <p className="mt-1 text-sm text-charcoal-400">
            {posts.length} {posts.length === 1 ? "post" : "posts"} published.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-charcoal-700 px-4 py-2.5 text-sm font-semibold text-beige-50 transition-colors hover:bg-rust-500"
        >
          <Plus size={16} weight="bold" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-charcoal-700/10 bg-beige-100/60 p-8 text-center text-sm text-charcoal-400">
          No posts yet. Create your first one to get started.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-charcoal-700/10 bg-beige-50">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-charcoal-700/10 bg-beige-100/60 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700/10">
              {posts.map((post) => {
                return (
                  <tr key={post.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 font-medium text-charcoal-700">
                        {post.featured ? (
                          <Star
                            size={14}
                            weight="fill"
                            className="shrink-0 text-rust-500"
                          />
                        ) : null}
                        {post.title}
                      </div>
                      <p className="mt-0.5 text-xs text-charcoal-300">
                        /{post.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-charcoal-500">
                      {post.categoryName}
                      {post.blogNumber != null ? (
                        <span className="ml-2 text-xs text-charcoal-300">
                          #{post.blogNumber}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-charcoal-500">{post.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-charcoal-500 transition-colors hover:bg-charcoal-700/5 hover:text-rust-600"
                        >
                          <PencilSimple size={15} />
                          Edit
                        </Link>
                        <DeletePostButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

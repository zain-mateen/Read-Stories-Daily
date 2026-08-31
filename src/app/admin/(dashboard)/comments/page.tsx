import Link from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react/ssr";
import DeleteCommentButton from "@/components/admin/DeleteCommentButton";
import { getAllComments } from "@/data/comments";

export const dynamic = "force-dynamic";

function formatWhen(createdAt: string): string {
  const date = new Date(createdAt.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return createdAt;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminCommentsPage() {
  const comments = await getAllComments();

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-800">
          Comments
        </h1>
        <p className="mt-1 text-sm text-charcoal-400">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}{" "}
          across all posts. Comments appear on the site as soon as they&apos;re
          posted — delete anything that shouldn&apos;t be there.
        </p>
      </div>

      {comments.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-charcoal-700/10 bg-beige-100/60 p-8 text-center text-sm text-charcoal-400">
          No comments yet.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-charcoal-700/10 bg-beige-50">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-charcoal-700/10 bg-beige-100/60 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              <tr>
                <th className="px-5 py-3">Comment</th>
                <th className="px-5 py-3">Post</th>
                <th className="px-5 py-3">Posted</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700/10">
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td className="max-w-md px-5 py-4">
                    <p className="font-medium text-charcoal-700">
                      {comment.authorName}
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-charcoal-500">
                      {comment.body}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/blog/${comment.postSlug}#comments`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-charcoal-500 transition-colors hover:text-rust-600"
                    >
                      <span className="line-clamp-2">{comment.postTitle}</span>
                      <ArrowSquareOut size={14} className="shrink-0" />
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-charcoal-500">
                    {formatWhen(comment.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end">
                      <DeleteCommentButton
                        id={comment.id}
                        authorName={comment.authorName}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

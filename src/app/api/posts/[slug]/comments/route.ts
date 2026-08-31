import { NextResponse } from "next/server";
import { getPostBySlug } from "@/data/posts";
import { createComment, getCommentsForPost } from "@/data/comments";
import { validateCommentPayload } from "@/lib/validateComment";
import { rateLimit } from "@/lib/rateLimit";

// Comments are read/written live and must never be cached.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/posts/[slug]/comments">
) {
  const { slug } = await ctx.params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return NextResponse.json(
      { error: "Post not found." },
      { status: 404, headers: NO_STORE }
    );
  }
  const comments = await getCommentsForPost(post.id);
  return NextResponse.json({ comments }, { headers: NO_STORE });
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/posts/[slug]/comments">
) {
  const { slug } = await ctx.params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return NextResponse.json(
      { error: "Post not found." },
      { status: 404, headers: NO_STORE }
    );
  }

  if (!rateLimit(`comment:${clientIp(request)}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "You're commenting too fast — wait a minute and try again." },
      { status: 429, headers: NO_STORE }
    );
  }

  const result = validateCommentPayload(
    await request.json().catch(() => null)
  );
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: 400, headers: NO_STORE }
    );
  }

  const comment = await createComment(post.id, result.name, result.body);
  return NextResponse.json({ comment }, { status: 201, headers: NO_STORE });
}

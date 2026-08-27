import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { validatePostPayload } from "@/lib/validatePost";
import { deletePost, getPostById, isSlugTaken, updatePost } from "@/data/posts";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/admin/posts/[id]">
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: idParam } = await ctx.params;
  const id = parseId(idParam);
  if (!id) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });

  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/admin/posts/[id]">
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: idParam } = await ctx.params;
  const id = parseId(idParam);
  if (!id) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });

  const existing = await getPostById(id);
  if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const result = validatePostPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (await isSlugTaken(result.input.slug, id)) {
    return NextResponse.json(
      { error: `A post with slug "${result.input.slug}" already exists.` },
      { status: 409 }
    );
  }

  await updatePost(id, result.input);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/posts/[id]">
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: idParam } = await ctx.params;
  const id = parseId(idParam);
  if (!id) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });

  const existing = await getPostById(id);
  if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  await deletePost(id);
  return NextResponse.json({ ok: true });
}

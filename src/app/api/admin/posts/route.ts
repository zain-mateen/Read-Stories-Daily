import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { validatePostPayload } from "@/lib/validatePost";
import { createPost, getAllPosts, isSlugTaken } from "@/data/posts";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const posts = await getAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = validatePostPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (await isSlugTaken(result.input.slug)) {
    return NextResponse.json(
      { error: `A post with slug "${result.input.slug}" already exists.` },
      { status: 409 }
    );
  }

  const id = await createPost(result.input);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}

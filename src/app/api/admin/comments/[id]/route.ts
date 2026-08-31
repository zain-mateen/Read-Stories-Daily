import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteComment, getCommentById } from "@/data/comments";

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/comments/[id]">
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await ctx.params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
  }

  if (!(await getCommentById(id))) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  await deleteComment(id);
  return NextResponse.json({ ok: true });
}

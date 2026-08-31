import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllComments } from "@/data/comments";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ comments: await getAllComments() });
}

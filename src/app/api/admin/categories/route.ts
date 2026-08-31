import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  createCategory,
  getAllCategories,
  isCategorySlug,
} from "@/data/categories";
import { slugify } from "@/lib/slugify";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ categories: await getAllCategories() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json(
      { error: "Category name is required." },
      { status: 400 }
    );
  }

  const slug = slugify(name);
  if (!slug) {
    return NextResponse.json(
      { error: "Enter a name that has letters or numbers." },
      { status: 400 }
    );
  }
  if (await isCategorySlug(slug)) {
    return NextResponse.json(
      { error: `A category "${name}" already exists.` },
      { status: 409 }
    );
  }

  const category = await createCategory(name);
  return NextResponse.json({ category }, { status: 201 });
}

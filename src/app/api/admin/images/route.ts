import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import sharp from "sharp";
import { isAuthenticated } from "@/lib/auth";
import { execute } from "@/lib/db";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected an image upload." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Use a PNG, JPEG, WebP, or GIF image." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller." },
      { status: 400 }
    );
  }

  const original = Buffer.from(await file.arrayBuffer());
  let data = original;
  // Downscale big photos to keep the database lean. Skip GIFs so we don't
  // flatten animation; fall back to the original bytes if sharp can't read it.
  if (file.type !== "image/gif") {
    try {
      data = await sharp(original)
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .toBuffer();
    } catch {
      data = original;
    }
  }

  const id = randomBytes(16).toString("hex");
  await execute(
    "INSERT INTO post_images (id, mime, byte_size, data) VALUES (?, ?, ?, ?)",
    [id, file.type, data.length, data]
  );

  return NextResponse.json({ id, url: `/api/images/${id}` }, { status: 201 });
}

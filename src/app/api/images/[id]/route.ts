import { query } from "@/lib/db";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/images/[id]">
) {
  const { id } = await ctx.params;
  if (!/^[a-f0-9]{32}$/.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const rows = await query<{ mime: string; data: Buffer }>(
    "SELECT mime, data FROM post_images WHERE id = ? LIMIT 1",
    [id]
  );
  const row = rows[0];
  if (!row) return new Response("Not found", { status: 404 });

  const body = new Uint8Array(row.data);
  return new Response(body, {
    headers: {
      "Content-Type": row.mime,
      "Content-Length": String(body.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

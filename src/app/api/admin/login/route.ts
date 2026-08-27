import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    if (typeof body?.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let valid: boolean;
  try {
    valid = Boolean(password) && verifyAdminPassword(password);
  } catch {
    return NextResponse.json(
      {
        error:
          "Server is missing ADMIN_PASSWORD / ADMIN_SESSION_SECRET environment variables.",
      },
      { status: 500 }
    );
  }

  if (!valid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h — keep in sync with SESSION_TTL_MS in lib/auth.ts
  });
  return response;
}

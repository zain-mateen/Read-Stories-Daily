import { createHmac, createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "rsd_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment variables."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/** Constant-time string comparison, safe for arbitrary (unequal) lengths. */
function safeCompare(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

/** Checks a submitted password against ADMIN_PASSWORD. */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to your environment variables."
    );
  }
  return safeCompare(password, expected);
}

/** Creates a signed, expiring session token to store in a cookie. */
export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })
  ).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = sign(payload);
  if (!safeCompare(signature, expectedSignature)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

/**
 * Defense-in-depth check for use inside Route Handlers, in addition to
 * (not instead of) the proxy.ts gate — see the "Data Security" note in
 * Next's proxy docs about not relying on the proxy matcher alone.
 */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE_NAME)?.value);
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings-server";
import { createHmac, randomBytes } from "crypto";

const COOKIE_NAME = "hmc_admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// ─── Secret key for HMAC tokens ───────────────────────────────
function getSecret(): string {
  // Use a dedicated env var, or derive from ADMIN_PASSWORD, or fallback
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "hmc2024-secret-key";
}

// ─── Token creation (HMAC-based, no password leakage) ────────
// Token format: <randomId>.<hmacSignature>
// The signature covers the randomId + timestamp, NOT the password.
function createToken(): string {
  const id = randomBytes(24).toString("hex");
  const ts = Date.now().toString(36);
  const payload = `${id}:${ts}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const payload = parts[0];
    const sig = parts[1];
    const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("hex");

    // Constant-time comparison to prevent timing attacks
    if (sig.length !== expectedSig.length) return false;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) {
      diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

// ─── Password helpers ────────────────────────────────────────
function getDefaultPassword(): string {
  return process.env.ADMIN_PASSWORD || "hmc2024";
}

// ─── Session check ───────────────────────────────────────────
export async function getSession(req: NextRequest): Promise<{ authenticated: boolean }> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return { authenticated: false };

  if (!verifyToken(token)) return { authenticated: false };

  return { authenticated: true };
}

// ─── Login ───────────────────────────────────────────────────
export async function login(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password : "";

    // Rate limiting: check X-Forwarded-For or fall back
    // (basic protection — for production, use a proper rate limiter)

    const settings = await getSettings();
    const expectedPassword = settings.adminPassword || getDefaultPassword();

    // Constant-time comparison for password
    if (password.length !== expectedPassword.length || !timingSafeEqual(password, expectedPassword)) {
      return NextResponse.json(
        { ok: false, error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = createToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("[auth login] error", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// ─── Logout ──────────────────────────────────────────────────
export function logout(): NextResponse {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}

// ─── Require auth helper (for API routes) ────────────────────
export function requireAuth(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json(
      { ok: false, error: "Non authentifié" },
      { status: 401 }
    );
  }
  return null; // authenticated
}

// ─── Timing-safe string comparison ───────────────────────────
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export { COOKIE_NAME };

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHmac, randomBytes } from "crypto";

const COOKIE_NAME = "hmc_admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// ─── Secret key for HMAC tokens ───────────────────────────────
function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "hmc2024-secret-key";
}

// ─── Token creation (HMAC-based, no password leakage) ────────
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

    // Constant-time comparison
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

// ─── Session check ───────────────────────────────────────────
export async function getSession(req: NextRequest): Promise<{
  authenticated: boolean;
  user?: { id: string; email: string; name: string; role: string };
}> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return { authenticated: false };

  // Decode user info from a second cookie
  const userCookie = req.cookies.get("hmc_admin_user")?.value;
  if (userCookie) {
    try {
      const user = JSON.parse(Buffer.from(userCookie, "base64").toString());
      return { authenticated: true, user };
    } catch {
      return { authenticated: true };
    }
  }

  return { authenticated: true };
}

// ─── Login (email + password) ────────────────────────────────
export async function login(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      console.warn(`[auth login] No user found for email: ${email}`);
      return NextResponse.json(
        { ok: false, error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    if (!user.active) {
      console.warn(`[auth login] User account inactive: ${email} (role=${user.role})`);
      return NextResponse.json(
        { ok: false, error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const bcrypt = await import("bcryptjs");
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      console.warn(`[auth login] Invalid password for: ${email}`);
      return NextResponse.json(
        { ok: false, error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    console.info(`[auth login] Success: ${email} (role=${user.role})`);

    // Create session token
    const token = createToken();

    // Store minimal user info in a separate cookie (non-httpOnly for client read, but signed)
    const userInfo = Buffer.from(
      JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role })
    ).toString("base64");

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    const isSecure = process.env.NODE_ENV === "production";

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    });

    res.cookies.set("hmc_admin_user", userInfo, {
      httpOnly: false,
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
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
  res.cookies.delete("hmc_admin_user");
  return res;
}

// ─── Require auth helper ─────────────────────────────────────
export function requireAuth(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json(
      { ok: false, error: "Non authentifié" },
      { status: 401 }
    );
  }
  return null;
}

export { COOKIE_NAME };

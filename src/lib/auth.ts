import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHmac, randomBytes } from "crypto";

const COOKIE_NAME = "hmc_admin_session";
const USER_COOKIE_NAME = "hmc_admin_user";
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

// ─── Determine if request is over HTTPS ──────────────────────
function isSecureRequest(req: NextRequest): boolean {
  const proto = req.headers.get("x-forwarded-proto");
  return proto === "https" || req.nextUrl.protocol === "https:";
}

// ─── Sign user info to prevent tampering ─────────────────────
function signUserInfo(data: string): string {
  const sig = createHmac("sha256", getSecret()).update(data).digest("hex");
  return `${data}.${sig}`;
}

function verifyUserInfo(signed: string): string | null {
  try {
    const parts = signed.split(".");
    if (parts.length !== 2) return null;
    const [data, sig] = parts;
    const expectedSig = createHmac("sha256", getSecret()).update(data).digest("hex");
    if (sig.length !== expectedSig.length) return null;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) {
      diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
    }
    return diff === 0 ? data : null;
  } catch {
    return null;
  }
}

// ─── Session check ───────────────────────────────────────────
export async function getSession(req: NextRequest): Promise<{
  authenticated: boolean;
  user?: { id: string; email: string; name: string; role: string };
}> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return { authenticated: false };

  // Decode user info from signed cookie
  const userCookie = req.cookies.get(USER_COOKIE_NAME)?.value;
  if (userCookie) {
    try {
      const verifiedData = verifyUserInfo(userCookie);
      if (verifiedData) {
        const user = JSON.parse(Buffer.from(verifiedData, "base64").toString());
        return { authenticated: true, user };
      }
    } catch {
      // Cookie tampered or invalid — fall through
    }
  }

  // If no valid user cookie, try to resolve from DB using session token
  // This is a fallback — the user cookie should always be present
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

    // Store user info in a signed cookie (non-httpOnly for client read, but signed to prevent tampering)
    const userData = Buffer.from(
      JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role })
    ).toString("base64");
    const signedUserInfo = signUserInfo(userData);

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    // Use secure cookies when served over HTTPS
    const secure = isSecureRequest(req);

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    });

    res.cookies.set(USER_COOKIE_NAME, signedUserInfo, {
      httpOnly: false,
      secure,
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
  res.cookies.delete(USER_COOKIE_NAME);
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

// ─── Require admin role helper ───────────────────────────────
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const session = await getSession(req);
  if (!session.authenticated) {
    return NextResponse.json(
      { ok: false, error: "Non authentifié" },
      { status: 401 }
    );
  }
  if (session.user?.role !== "admin") {
    return NextResponse.json(
      { ok: false, error: "Accès réservé aux administrateurs." },
      { status: 403 }
    );
  }
  return null;
}

// ─── Require manager+ role helper (admin or manager) ─────────
export async function requireManager(req: NextRequest): Promise<NextResponse | null> {
  const session = await getSession(req);
  if (!session.authenticated) {
    return NextResponse.json(
      { ok: false, error: "Non authentifié" },
      { status: 401 }
    );
  }
  if (session.user?.role !== "admin" && session.user?.role !== "manager") {
    return NextResponse.json(
      { ok: false, error: "Accès réservé aux managers et administrateurs." },
      { status: 403 }
    );
  }
  return null;
}

export { COOKIE_NAME, USER_COOKIE_NAME };

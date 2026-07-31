import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings-server";

const COOKIE_NAME = "hmc_admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// Simple token: base64 of password + timestamp (not cryptographically secure, but sufficient for a demo dashboard)
function createToken(password: string): string {
  const payload = JSON.stringify({ p: password, t: Date.now() });
  return Buffer.from(payload).toString("base64");
}

function verifyToken(token: string, password: string): boolean {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    return decoded.p === password;
  } catch {
    return false;
  }
}

function getDefaultPassword(): string {
  return process.env.ADMIN_PASSWORD || "hmc2024";
}

export async function getSession(req: NextRequest): Promise<{ authenticated: boolean }> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return { authenticated: false };

  const settings = await getSettings();
  const password = settings.adminPassword || getDefaultPassword();

  return { authenticated: verifyToken(token, password) };
}

export async function login(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password : "";

    const settings = await getSettings();
    const expectedPassword = settings.adminPassword || getDefaultPassword();

    if (password !== expectedPassword) {
      return NextResponse.json(
        { ok: false, error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = createToken(password);
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

export function logout(): NextResponse {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}

export function requireAuth(req: NextRequest): NextResponse | null {
  // This is a synchronous check using the cookie existence.
  // Full verification happens in the route handler via getSession.
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Non authentifié" },
      { status: 401 }
    );
  }
  return null;
}

export { COOKIE_NAME };

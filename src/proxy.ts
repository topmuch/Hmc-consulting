import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "hmc_admin_session";

// ─── Protected API routes (require admin session) ─────────────
const PROTECTED_PATTERNS = [
  "/api/messages",
  "/api/clients",
  "/api/leads",
  "/api/users",
  "/api/settings",
  "/api/notifications",
  "/api/reports",
];

// ─── Public API routes (no auth needed) ──────────────────────
const PUBLIC_PATTERNS = [
  "/api/auth",
  "/api/contact",
  "/api/health",
];

// ─── Clean URL rewrites (SEO-friendly) ──────────────────────
const PAGE_ROUTES = new Set([
  "services",
  "produits",
  "histoire",
  "valeurs",
  "experience",
  "expertise",
  "contact",
  "blog",
  "equipe",
]);

function isProtected(pathname: string): boolean {
  return PROTECTED_PATTERNS.some((p) => pathname.startsWith(p));
}

function isPublic(pathname: string): boolean {
  return PUBLIC_PATTERNS.some((p) => pathname.startsWith(p));
}

function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "hmc2024-secret-key";
}

// ─── HMAC verification using Web Crypto API (Edge Runtime compatible) ────
async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const payload = parts[0];
    const sig = parts[1];

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(getSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload)
    );

    const expectedSig = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

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

// Next.js 16 uses `proxy` export instead of `middleware`
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Clean URL rewrites (SEO-friendly) ──────────────────────
  // /services → /?page=services, /produits/qrbags → /?product=qrbags, etc.
  if (!pathname.startsWith("/_next") && !pathname.startsWith("/api") && pathname !== "/") {
    const segments = pathname.split("/").filter(Boolean);

    // /produits/{productId} → /?product=productId
    if (segments.length === 2 && segments[0] === "produits") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("product", segments[1]);
      return NextResponse.rewrite(url);
    }

    // /{pageId} → /?page=pageId
    if (segments.length === 1 && PAGE_ROUTES.has(segments[0])) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("page", segments[0]);
      return NextResponse.rewrite(url);
    }
  }

  // ─── API route protection ──────────────────────────────────
  // Allow public routes
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Check protection
  if (isProtected(pathname)) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon\\.ico|.*\\..*).*)"],
};

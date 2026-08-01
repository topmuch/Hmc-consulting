import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);

  // Debug logging for production troubleshooting
  if (!session.authenticated) {
    const sessionCookie = req.cookies.get("hmc_admin_session")?.value;
    const userCookie = req.cookies.get("hmc_admin_user")?.value;
    console.warn(
      `[auth/me] Not authenticated — session_cookie=${sessionCookie ? "present" : "missing"} user_cookie=${userCookie ? "present" : "missing"} x-forwarded-proto=${req.headers.get("x-forwarded-proto") || "(none)"} host=${req.headers.get("host") || "(none)"}`
    );
  }

  return NextResponse.json({
    authenticated: session.authenticated,
    user: session.user || null,
  });
}

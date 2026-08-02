import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/auth/check
 * Diagnostic endpoint to verify admin users exist in the database.
 * Only available with DEBUG_AUTH env var set.
 */
export async function GET(req: NextRequest) {
  // Security gate: only allow with explicit DEBUG_AUTH env var
  if (!process.env.DEBUG_AUTH) {
    return NextResponse.json(
      { ok: false, error: "Endpoint non disponible en production." },
      { status: 403 }
    );
  }

  try {
    const count = await db.user.count();

    return NextResponse.json({
      ok: true,
      totalUsers: count,
      env: {
        DATABASE_URL_set: !!process.env.DATABASE_URL,
        ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
        NODE_ENV: process.env.NODE_ENV || "(not set)",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        error: "Database connection failed",
        detail: message,
        env: {
          DATABASE_URL_set: !!process.env.DATABASE_URL,
          ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
          NODE_ENV: process.env.NODE_ENV || "(not set)",
        },
      },
      { status: 500 }
    );
  }
}

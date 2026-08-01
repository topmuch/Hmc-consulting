import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/auth/check
 * Diagnostic endpoint to verify admin users exist in the database.
 * Returns user count and emails (no passwords) for debugging login issues.
 * Only available in non-production or with explicit DEBUG_AUTH env var.
 */
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: { id: true, email: true, name: true, role: true, active: true },
    });

    return NextResponse.json({
      ok: true,
      totalUsers: users.length,
      users: users.map((u) => ({
        email: u.email,
        name: u.name,
        role: u.role,
        active: u.active,
      })),
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

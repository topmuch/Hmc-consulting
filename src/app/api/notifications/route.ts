import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unreadOnly") === "true";
  const limit = Math.min(
    parseInt(url.searchParams.get("limit") || "50", 10),
    200
  );

  const where = unreadOnly ? { read: false } : {};
  const notifications = await db.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const unreadCount = await db.notification.count({ where: { read: false } });

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      await db.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });
      return NextResponse.json({ ok: true, marked: "all" });
    }

    if (typeof id === "string") {
      await db.notification.update({
        where: { id },
        data: { read: true },
      });
      return NextResponse.json({ ok: true, id });
    }

    return NextResponse.json(
      { error: "Paramètre 'id' ou 'markAllRead' requis." },
      { status: 400 }
    );
  } catch (err) {
    console.error("[api/notifications PATCH] error", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  await db.notification.deleteMany({});
  return NextResponse.json({ ok: true });
}

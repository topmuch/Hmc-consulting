import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json(
        { ok: false, error: "Article introuvable." },
        { status: 404 }
      );
    }

    // If the post is not published, only allow admin to view it
    if (!post.published) {
      const session = await getSession(req);
      if (!session.authenticated || session.user?.role !== "admin") {
        return NextResponse.json(
          { ok: false, error: "Article introuvable." },
          { status: 404 }
        );
      }
    }

    // Fetch author name
    const author = await db.user.findUnique({
      where: { id: post.authorId },
      select: { name: true },
    });

    return NextResponse.json({
      ok: true,
      post: { ...post, authorName: author?.name || "HMC" },
    });
  } catch (err) {
    console.error("[api/posts/[id] GET] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const { id } = await params;
    const existing = await db.post.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Article introuvable." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const data: { title?: string; content?: string | null; imageUrl?: string | null; published?: boolean } = {};

    if (typeof body?.title === "string" && body.title.trim()) {
      data.title = body.title.trim();
    }
    if (typeof body?.content === "string") {
      data.content = body.content.trim() || null;
    }
    if (typeof body?.imageUrl === "string") {
      data.imageUrl = body.imageUrl.trim() || null;
    }
    if (typeof body?.published === "boolean") {
      data.published = body.published;
    }

    const updated = await db.post.update({
      where: { id },
      data,
    });

    // Fetch author name for the updated post
    const author = await db.user.findUnique({
      where: { id: updated.authorId },
      select: { name: true },
    });

    return NextResponse.json({ ok: true, post: { ...updated, authorName: author?.name || "HMC" } });
  } catch (err) {
    console.error("[api/posts/[id] PATCH] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const { id } = await params;
    const existing = await db.post.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Article introuvable." },
        { status: 404 }
      );
    }

    await db.post.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/posts/[id] DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

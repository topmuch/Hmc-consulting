import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "true";

    // If ?all=true, require admin and return all posts (including drafts)
    let where: { published?: boolean } = { published: true };
    if (all) {
      const denied = await requireAdmin(req);
      if (denied) return denied;
      where = {};
    }

    const posts = await db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Fetch author names for all posts (no Prisma relation defined)
    const authorIds = [...new Set(posts.map((p) => p.authorId))];
    const authors = await db.user.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, name: true },
    });
    const authorMap = new Map(authors.map((a) => [a.id, a.name]));

    const postsWithAuthor = posts.map((post) => ({
      ...post,
      authorName: authorMap.get(post.authorId) || "HMC",
    }));

    return NextResponse.json({ ok: true, posts: postsWithAuthor });
  } catch (err) {
    console.error("[api/posts GET] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const body = await req.json();

    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const content =
      typeof body?.content === "string" ? body.content.trim() : null;
    const published = typeof body?.published === "boolean" ? body.published : true;

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Le titre est obligatoire." },
        { status: 400 }
      );
    }

    // Get the authenticated user's ID from session
    const session = await (await import("@/lib/auth")).getSession(req);
    const authorId = session.user?.id;

    if (!authorId) {
      return NextResponse.json(
        { ok: false, error: "Impossible de déterminer l'auteur." },
        { status: 401 }
      );
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        published,
        authorId,
      },
    });

    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (err) {
    console.error("[api/posts POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

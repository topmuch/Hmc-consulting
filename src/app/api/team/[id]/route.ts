import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamMember = await db.teamMember.findUnique({ where: { id } });

    if (!teamMember) {
      return NextResponse.json(
        { ok: false, error: "Membre introuvable." },
        { status: 404 }
      );
    }

    // If the team member is not published, only allow admin to view it
    if (!teamMember.published) {
      const session = await getSession(req);
      if (!session.authenticated || session.user?.role !== "admin") {
        return NextResponse.json(
          { ok: false, error: "Membre introuvable." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ ok: true, teamMember });
  } catch (err) {
    console.error("[api/team/[id] GET] error", err);
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
    const existing = await db.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Membre introuvable." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const data: { name?: string; role?: string; bio?: string; image?: string; speciality?: string; published?: boolean } = {};

    if (typeof body?.name === "string" && body.name.trim()) {
      data.name = body.name.trim();
    }
    if (typeof body?.role === "string") {
      data.role = body.role.trim();
    }
    if (typeof body?.bio === "string") {
      data.bio = body.bio.trim();
    }
    if (typeof body?.image === "string") {
      data.image = body.image.trim();
    }
    if (typeof body?.speciality === "string") {
      data.speciality = body.speciality.trim();
    }
    if (typeof body?.published === "boolean") {
      data.published = body.published;
    }

    const updated = await db.teamMember.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true, teamMember: updated });
  } catch (err) {
    console.error("[api/team/[id] PATCH] error", err);
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
    const existing = await db.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Membre introuvable." },
        { status: 404 }
      );
    }

    await db.teamMember.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/team/[id] DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

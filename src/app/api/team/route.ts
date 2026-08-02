import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "true";

    // If ?all=true, require admin and return all team members (including unpublished)
    let where: { published?: boolean } = { published: true };
    if (all) {
      const denied = await requireAdmin(req);
      if (denied) return denied;
      where = {};
    }

    const teamMembers = await db.teamMember.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, teamMembers });
  } catch (err) {
    console.error("[api/team GET] error", err);
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

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const role = typeof body?.role === "string" ? body.role.trim() : "";
    const bio = typeof body?.bio === "string" ? body.bio.trim() : "";
    const image = typeof body?.image === "string" ? body.image.trim() : "";
    const speciality = typeof body?.speciality === "string" ? body.speciality.trim() : "";
    const published = typeof body?.published === "boolean" ? body.published : true;

    if (!name || !role || !bio) {
      return NextResponse.json(
        { ok: false, error: "Les champs nom, rôle et bio sont obligatoires." },
        { status: 400 }
      );
    }

    const teamMember = await db.teamMember.create({
      data: {
        name,
        role,
        bio,
        image,
        speciality,
        published,
      },
    });

    return NextResponse.json({ ok: true, teamMember }, { status: 201 });
  } catch (err) {
    console.error("[api/team POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

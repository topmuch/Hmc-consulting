import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "true";

    // If ?all=true, require admin and return all testimonials (including unpublished)
    let where: { published?: boolean } = { published: true };
    if (all) {
      const denied = await requireAdmin(req);
      if (denied) return denied;
      where = {};
    }

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, testimonials });
  } catch (err) {
    console.error("[api/testimonials GET] error", err);
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
    const company = typeof body?.company === "string" ? body.company.trim() : "";
    const role = typeof body?.role === "string" ? body.role.trim() : "";
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    const image = typeof body?.image === "string" ? body.image.trim() : "";
    const project = typeof body?.project === "string" ? body.project.trim() : "";
    const published = typeof body?.published === "boolean" ? body.published : true;

    if (!name || !company || !role || !content) {
      return NextResponse.json(
        { ok: false, error: "Les champs nom, entreprise, rôle et contenu sont obligatoires." },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        company,
        role,
        content,
        image,
        project,
        published,
      },
    });

    return NextResponse.json({ ok: true, testimonial }, { status: 201 });
  } catch (err) {
    console.error("[api/testimonials POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

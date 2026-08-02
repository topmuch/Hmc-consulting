import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonial = await db.testimonial.findUnique({ where: { id } });

    if (!testimonial) {
      return NextResponse.json(
        { ok: false, error: "Témoignage introuvable." },
        { status: 404 }
      );
    }

    // If the testimonial is not published, only allow admin to view it
    if (!testimonial.published) {
      const session = await getSession(req);
      if (!session.authenticated || session.user?.role !== "admin") {
        return NextResponse.json(
          { ok: false, error: "Témoignage introuvable." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ ok: true, testimonial });
  } catch (err) {
    console.error("[api/testimonials/[id] GET] error", err);
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
    const existing = await db.testimonial.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Témoignage introuvable." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const data: { name?: string; company?: string; role?: string; content?: string; image?: string; project?: string; published?: boolean } = {};

    if (typeof body?.name === "string" && body.name.trim()) {
      data.name = body.name.trim();
    }
    if (typeof body?.company === "string") {
      data.company = body.company.trim();
    }
    if (typeof body?.role === "string") {
      data.role = body.role.trim();
    }
    if (typeof body?.content === "string") {
      data.content = body.content.trim();
    }
    if (typeof body?.image === "string") {
      data.image = body.image.trim();
    }
    if (typeof body?.project === "string") {
      data.project = body.project.trim();
    }
    if (typeof body?.published === "boolean") {
      data.published = body.published;
    }

    const updated = await db.testimonial.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true, testimonial: updated });
  } catch (err) {
    console.error("[api/testimonials/[id] PATCH] error", err);
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
    const existing = await db.testimonial.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Témoignage introuvable." },
        { status: 404 }
      );
    }

    await db.testimonial.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/testimonials/[id] DELETE] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

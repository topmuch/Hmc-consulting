import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getSettings } from "@/lib/settings-server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await req.json();
    const replyBody =
      typeof body?.body === "string" ? body.body.trim() : "";

    if (!replyBody) {
      return NextResponse.json(
        { ok: false, error: "Le corps du message est requis." },
        { status: 400 }
      );
    }

    const original = await db.contactMessage.findUnique({ where: { id } });
    if (!original) {
      return NextResponse.json(
        { ok: false, error: "Message introuvable." },
        { status: 404 }
      );
    }

    const settings = await getSettings();

    // Build a nicely styled reply email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #003070; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">${settings.siteFullName}</h1>
          <p style="color: #50b0e0; margin: 4px 0 0; font-size: 13px;">${settings.tagline}</p>
        </div>
        <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 15px;">Bonjour ${original.name},</p>
          <div style="color: #555; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(replyBody)}</div>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              ${settings.partner} — ${settings.partnerRole}<br/>
              📞 ${settings.phone} · ✉️ ${settings.email}<br/>
              Afrique & Océan Indien
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: original.email,
      subject: `Re: ${original.subject}`,
      body: htmlBody,
      type: "reply",
      messageId: original.id,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/messages/[id]/reply] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

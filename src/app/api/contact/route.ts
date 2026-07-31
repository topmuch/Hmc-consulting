import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings, maybeCreateNotification } from "@/lib/settings-server";
import { sendAutoReply, sendNewMessageNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const company =
      typeof body?.company === "string" && body.company.trim()
        ? body.company.trim()
        : null;
    const phone =
      typeof body?.phone === "string" && body.phone.trim() ? body.phone.trim() : null;
    const productId =
      typeof body?.productId === "string" && body.productId.trim()
        ? body.productId.trim()
        : null;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    // Simple email format check
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Message trop long (max 5000 caractères)." },
        { status: 400 }
      );
    }

    const record = await db.contactMessage.create({
      data: {
        name,
        email,
        company,
        phone,
        subject,
        message,
        productId,
      },
    });

    // Create an in-app notification if enabled in settings
    const settings = await getSettings();
    await maybeCreateNotification(
      "new_message",
      `Nouveau message de ${name}`,
      `Sujet : ${subject}${company ? ` · ${company}` : ""}`,
      `/?view=dashboard`,
      settings.notifyOnNewMessage
    );

    // Send auto-reply to the contact form submitter (respects autoReplyEnabled)
    try {
      await sendAutoReply(name, email, subject);
    } catch (err) {
      console.error("[api/contact] sendAutoReply error", err);
    }

    // Notify the team about the new message (respects notifyOnNewMessage)
    try {
      await sendNewMessageNotification(name, subject, company);
    } catch (err) {
      console.error("[api/contact] sendNewMessageNotification error", err);
    }

    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error("[api/contact] error", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez ultérieurement." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings-server";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings-types";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();

    // Extract and validate fields
    const s: Partial<SiteSettings> = {};
    const str = (v: unknown): string | null =>
      typeof v === "string" ? v.trim() : null;

    if (typeof body.siteName === "string") s.siteName = body.siteName.trim();
    if (typeof body.siteFullName === "string") s.siteFullName = body.siteFullName.trim();
    if (typeof body.tagline === "string") s.tagline = body.tagline.trim();
    if (typeof body.email === "string") s.email = body.email.trim();
    if (typeof body.phone === "string") s.phone = body.phone.trim();
    if (typeof body.partner === "string") s.partner = body.partner.trim();
    if (typeof body.partnerRole === "string") s.partnerRole = body.partnerRole.trim();
    s.seoTitle = str(body.seoTitle);
    s.seoDescription = str(body.seoDescription);
    s.seoKeywords = str(body.seoKeywords);
    s.ogImage = str(body.ogImage);
    s.notifyEmail = str(body.notifyEmail);
    if (typeof body.notifyOnNewMessage === "boolean")
      s.notifyOnNewMessage = body.notifyOnNewMessage;
    if (typeof body.notifyDailyDigest === "boolean")
      s.notifyDailyDigest = body.notifyDailyDigest;
    if (typeof body.notifyWeeklyDigest === "boolean")
      s.notifyWeeklyDigest = body.notifyWeeklyDigest;
    s.linkedin = str(body.linkedin);
    s.twitter = str(body.twitter);
    s.facebook = str(body.facebook);
    s.instagram = str(body.instagram);

    // SMTP / Email
    s.smtpHost = str(body.smtpHost);
    s.smtpPort = str(body.smtpPort);
    s.smtpUser = str(body.smtpUser);
    s.smtpPass = str(body.smtpPass);
    s.smtpFrom = str(body.smtpFrom);

    // Auth
    s.adminPassword = str(body.adminPassword);

    // Auto-reply
    if (typeof body.autoReplyEnabled === "boolean")
      s.autoReplyEnabled = body.autoReplyEnabled;

    // Email format check on notifyEmail if provided
    if (s.notifyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.notifyEmail)) {
      return NextResponse.json(
        { error: "L'email de notification est invalide." },
        { status: 400 }
      );
    }
    if (s.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) {
      return NextResponse.json(
        { error: "L'email de contact est invalide." },
        { status: 400 }
      );
    }
    if (s.smtpFrom) {
      // Accept both "Name <email>" and plain "email" formats
      const emailMatch = s.smtpFrom.match(/<([^>]+)>/) || [null, s.smtpFrom];
      const emailPart = emailMatch[1];
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPart)) {
        return NextResponse.json(
          { error: "L'email expéditeur SMTP est invalide." },
          { status: 400 }
        );
      }
    }

    const data = { ...DEFAULT_SETTINGS, ...s };

    const updated = await db.siteSetting.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    return NextResponse.json({
      ok: true,
      settings: {
        siteName: updated.siteName,
        siteFullName: updated.siteFullName,
        tagline: updated.tagline,
        email: updated.email,
        phone: updated.phone,
        partner: updated.partner,
        partnerRole: updated.partnerRole,
        seoTitle: updated.seoTitle,
        seoDescription: updated.seoDescription,
        seoKeywords: updated.seoKeywords,
        ogImage: updated.ogImage,
        notifyEmail: updated.notifyEmail,
        notifyOnNewMessage: updated.notifyOnNewMessage,
        notifyDailyDigest: updated.notifyDailyDigest,
        notifyWeeklyDigest: updated.notifyWeeklyDigest,
        linkedin: updated.linkedin,
        twitter: updated.twitter,
        facebook: updated.facebook,
        instagram: updated.instagram,
        smtpHost: updated.smtpHost,
        smtpPort: updated.smtpPort,
        smtpUser: updated.smtpUser,
        smtpPass: updated.smtpPass,
        smtpFrom: updated.smtpFrom,
        adminPassword: updated.adminPassword,
        autoReplyEnabled: updated.autoReplyEnabled,
      },
    });
  } catch (err) {
    console.error("[api/settings PUT] error", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la sauvegarde." },
      { status: 500 }
    );
  }
}

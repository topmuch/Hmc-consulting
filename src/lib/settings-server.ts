import { db } from "@/lib/db";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings-types";

/**
 * Get the singleton site settings. Falls back to defaults if not found.
 * Server-side only (uses Prisma).
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const row = await db.siteSetting.findUnique({ where: { id: "singleton" } });
    if (!row) return DEFAULT_SETTINGS;
    return {
      siteName: row.siteName,
      siteFullName: row.siteFullName,
      tagline: row.tagline,
      email: row.email,
      phone: row.phone,
      partner: row.partner,
      partnerRole: row.partnerRole,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      seoKeywords: row.seoKeywords,
      ogImage: row.ogImage,
      notifyEmail: row.notifyEmail,
      notifyOnNewMessage: row.notifyOnNewMessage,
      notifyDailyDigest: row.notifyDailyDigest,
      notifyWeeklyDigest: row.notifyWeeklyDigest,
      linkedin: row.linkedin,
      twitter: row.twitter,
      facebook: row.facebook,
      instagram: row.instagram,
    };
  } catch (err) {
    console.error("[getSettings] error", err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Create an in-app notification if the relevant setting is enabled.
 */
export async function maybeCreateNotification(
  type: string,
  title: string,
  message: string,
  link: string | null,
  enabledFlag: boolean
) {
  if (!enabledFlag) return null;
  try {
    return await db.notification.create({
      data: { type, title, message, link },
    });
  } catch (err) {
    console.error("[maybeCreateNotification] error", err);
    return null;
  }
}

import type { Metadata } from "next";
import { Geist, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getSettings } from "@/lib/settings-server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hmc-consulting.pro";

const FALLBACK_TITLE = "HMC — Horizon Management Consulting | Conseil et management des entreprises";
const FALLBACK_DESC =
  "HMC est un cabinet de conseil et de management dédié aux entreprises. Conseil stratégique, management opérationnel et structuration financière. Près de 30 ans d'expérience en Afrique et Océan Indien.";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();

  const title = s.seoTitle?.trim() || `${s.siteName} — ${s.siteFullName}`;
  const description = s.seoDescription?.trim() || FALLBACK_DESC;
  const keywords = s.seoKeywords
    ? s.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [s.siteName, s.siteFullName, "conseil entreprise", "management", "consulting stratégique", "Afrique", "transformation digitale", "QR code", "traçabilité"];

  return {
    title,
    description,
    keywords,
    authors: [{ name: s.siteFullName }],
    creator: s.siteFullName,
    publisher: s.siteFullName,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: BASE_URL,
    },
    icons: { icon: "/hmc-logo.png" },
    openGraph: {
      title: s.seoTitle?.trim() || `${s.siteName} — ${s.siteFullName}`,
      description,
      siteName: s.siteName,
      type: "website",
      locale: "fr_FR",
      url: BASE_URL,
      ...(s.ogImage ? { images: [{ url: s.ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: s.seoTitle?.trim() || `${s.siteName} — ${s.siteFullName}`,
      description,
      ...(s.ogImage ? { images: [s.ogImage] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-site-verification-code-here",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#003070" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

export const metadataFallback = { title: FALLBACK_TITLE, description: FALLBACK_DESC };

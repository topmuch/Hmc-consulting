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

const FALLBACK_TITLE = "HMC — Horizon Management Consulting | Conseil et management des entreprises";
const FALLBACK_DESC =
  "HMC est un cabinet de conseil et de management dédié aux entreprises. Conseil stratégique, management opérationnel et structuration financière. Près de 30 ans d'expérience en Afrique et Océan Indien.";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();

  const title = s.seoTitle?.trim() || `${s.siteName} — ${s.siteFullName}`;
  const description = s.seoDescription?.trim() || FALLBACK_DESC;
  const keywords = s.seoKeywords
    ? s.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [s.siteName, s.siteFullName, "conseil entreprise", "management", "consulting stratégique", "Afrique"];

  return {
    title,
    description,
    keywords,
    authors: [{ name: s.siteFullName }],
    icons: { icon: "/hmc-logo.png" },
    openGraph: {
      title: s.seoTitle?.trim() || `${s.siteName} — ${s.siteFullName}`,
      description,
      siteName: s.siteName,
      type: "website",
      ...(s.ogImage ? { images: [{ url: s.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: s.seoTitle?.trim() || `${s.siteName} — ${s.siteFullName}`,
      description,
      ...(s.ogImage ? { images: [s.ogImage] } : {}),
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

import type { Metadata } from "next";
import { Geist, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  title: "HMC — Horizon Management Consulting | Conseil et management des entreprises",
  description:
    "HMC est un cabinet de conseil et de management dédié aux entreprises. Conseil stratégique, management opérationnel et structuration financière. Près de 30 ans d'expérience en Afrique et Océan Indien.",
  keywords: [
    "HMC",
    "Horizon Management Consulting",
    "conseil entreprise",
    "management",
    "consulting stratégique",
    "management de transition",
    "structuration financière",
    "Afrique",
  ],
  authors: [{ name: "HMC" }],
  icons: {
    icon: "/hmc-logo.png",
  },
  openGraph: {
    title: "HMC — Horizon Management Consulting",
    description:
      "Conseil et management des entreprises. Partenaire de votre développement stratégique.",
    siteName: "HMC",
    type: "website",
  },
};

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

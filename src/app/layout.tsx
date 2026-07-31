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
  title: "HMC — Hospitality Management Consulting | Partenaire de votre développement stratégique",
  description:
    "HMC est un cabinet de consulting stratégique et d'accompagnement dédié au secteur hôtelier et immobilier, du segment Haut de Gamme (Luxe) à l'économique. Près de 30 ans d'expérience en Afrique et Océan Indien.",
  keywords: [
    "HMC",
    "Hospitality Management Consulting",
    "consulting hôtelier",
    "asset management",
    "gestion hôtelière",
    "luxe",
    "Afrique",
    "stratégie hôtelière",
  ],
  authors: [{ name: "HMC" }],
  icons: {
    icon: "/hmc-logo.png",
  },
  openGraph: {
    title: "HMC — Hospitality Management Consulting",
    description:
      "Partenaire de votre développement stratégique. Consulting hôtelier et immobilier, du Luxe à l'économique.",
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
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

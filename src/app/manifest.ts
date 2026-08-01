import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hmc-consulting.pro";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HMC — Horizon Management Consulting",
    short_name: "HMC",
    description:
      "Cabinet de conseil et de management dédié aux entreprises. Conseil stratégique, management opérationnel et transformation digitale.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#003070",
    lang: "fr",
    icons: [
      {
        src: "/hmc-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}

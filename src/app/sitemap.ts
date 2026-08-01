import { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products-data";
import { PAGES } from "@/lib/site-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hmc-consulting.pro";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Homepage
  const home: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Static pages (histoire, valeurs, services, experience, expertise, contact)
  const pages: MetadataRoute.Sitemap = PAGES.map((page) => ({
    url: `${BASE_URL}/?page=${page.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: page.id === "services" || page.id === "produits" ? 0.9 : 0.8,
  }));

  // Products overview
  const productsOverview: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/?page=produits`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Individual product pages
  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${BASE_URL}/?product=${product.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...home, ...pages, ...productsOverview, ...productPages];
}

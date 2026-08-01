import { COMPANY } from "@/lib/site-data";
import { PRODUCTS } from "@/lib/products-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hmc-consulting.pro";

/**
 * Organization JSON-LD — used on every page
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.fullName,
    alternateName: COMPANY.name,
    url: BASE_URL,
    logo: `${BASE_URL}/hmc-logo.png`,
    description: COMPANY.tagline,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    foundingLocation: {
      "@type": "Place",
      name: "Dakar, Sénégal",
    },
    areaServed: {
      "@type": "Place",
      name: "Afrique et Océan Indien",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: COMPANY.email,
      telephone: COMPANY.phone,
      contactType: "customer service",
      availableLanguage: ["Français", "English"],
    },
  };
}

/**
 * WebSite JSON-LD — used on homepage
 */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY.fullName,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/?page=services&q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * LocalBusiness JSON-LD — used on homepage
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: COMPANY.fullName,
    alternateName: COMPANY.name,
    url: BASE_URL,
    logo: `${BASE_URL}/hmc-logo.png`,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
    areaServed: {
      "@type": "Place",
      name: "Afrique et Océan Indien",
    },
    priceRange: "$$",
    openingHours: "Mo-Fr 08:00-18:00",
  };
}

/**
 * Service JSON-LD — used on services page
 */
export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services HMC",
    description: "Nos services de conseil et management des entreprises",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Service",
          name: "Conseil Stratégique",
          description:
            "Une connaissance profonde des secteurs d'activité nous permet d'adapter nos interventions à chaque typologie d'entreprise.",
          provider: {
            "@type": "Organization",
            name: COMPANY.fullName,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Service",
          name: "Management Opérationnel",
          description:
            "Une offre complète couvrant le management de transition, l'organisation et le pilotage de la performance.",
          provider: {
            "@type": "Organization",
            name: COMPANY.fullName,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Service",
          name: "Transformation",
          description:
            "L'application de solutions digitales et de méthodes éprouvées à notre expertise pour des accompagnements modernes et mesurables.",
          provider: {
            "@type": "Organization",
            name: COMPANY.fullName,
          },
        },
      },
    ],
  };
}

/**
 * Products JSON-LD — used on products page
 */
export function productsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Produits HMC",
    description: "Nos solutions digitales basées sur la technologie QR code",
    itemListElement: PRODUCTS.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        category: product.category,
        url: `${BASE_URL}/?product=${product.id}`,
        brand: {
          "@type": "Brand",
          name: COMPANY.fullName,
        },
      },
    })),
  };
}

/**
 * Breadcrumb JSON-LD — used on sub-pages
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQ JSON-LD — used on specific pages
 */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

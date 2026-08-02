"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Blog } from "@/components/sections/blog";
import { Testimonials } from "@/components/sections/testimonials";
import { Newsletter } from "@/components/sections/newsletter";
import { QuoteGenerator } from "@/components/sections/quote-generator";
import { AppointmentBooking } from "@/components/sections/appointment-booking";
import { SERVICES } from "@/lib/site-data";
import { PRODUCTS } from "@/lib/products-data";
import { ServiceCard } from "@/components/ui/service-card";
import { ProductCard } from "@/components/ui/product-card";
import { useTranslation } from "@/lib/i18n";

export function HomeOverview() {
  const { t } = useTranslation();

  return (
    <>
      {/* ── Services section ── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("home.exploreEyebrow")}
            title={
              <>
                {t("home.exploreTitle1")} <span className="italic text-accent">{t("home.exploreTitle2")}</span>
              </>
            }
            description={t("home.exploreDescription")}
            align="center"
            className="mx-auto"
          />

          {/* Three service pillars */}
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>

          {/* Link to full services page */}
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
            >
              {t("home.servicesLink")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Products section ── */}
      <section className="py-20 sm:py-28 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("home.productsEyebrow")}
            title={
              <>
                {t("home.productsTitle1")} <span className="italic text-accent">{t("home.productsTitle2")}</span>
              </>
            }
            description={t("home.productsDescription")}
            align="center"
            className="mx-auto"
          />

          {/* Products grid */}
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Link to full products page */}
          <div className="mt-10 text-center">
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
            >
              {t("home.productsLink")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-navy" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky/10 blur-3xl" />
            <div className="relative px-6 sm:px-12 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white text-balance">
                  {t("home.ctaTitle1")} <span className="italic text-sky-light">{t("home.ctaTitle2")}</span>
                </h3>
                <p className="mt-2 text-white/75 max-w-xl">
                  {t("home.ctaDescription")}
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-sky text-navy px-6 py-3 text-sm font-medium hover:bg-sky-light transition-colors group whitespace-nowrap"
              >
                {t("home.ctaLink")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Generator section ── */}
      <QuoteGenerator />

      {/* ── Blog section ── */}
      <Blog />

      {/* ── Testimonials section ── */}
      <Testimonials />

      {/* ── Appointment Booking section ── */}
      <AppointmentBooking />

      {/* ── Newsletter section ── */}
      <Newsletter />
    </>
  );
}

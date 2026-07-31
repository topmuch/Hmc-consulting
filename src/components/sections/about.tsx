"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { COMPANY } from "@/lib/site-data";

export function About() {
  return (
    <section id="histoire" className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/about-team.jpg"
                alt="Équipe de consultants collaborant en bureau"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-background rounded-xl shadow-xl border border-border p-5 max-w-[200px]">
              <div className="font-serif text-4xl font-semibold text-accent">
                +{COMPANY.yearsExperience}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                ans d&apos;expérience en conseil et management
              </div>
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-4 -left-4 -z-10 h-24 w-24 border-l-2 border-t-2 border-accent/40 rounded-tl-xl" />
          </motion.div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Notre Histoire"
              title={
                <>
                  Une rencontre entre{" "}
                  <span className="italic text-accent">expertise</span> et excellence
                  managériale
                </>
              }
            />
            <div className="mt-6 space-y-5 text-muted-foreground text-base sm:text-lg leading-relaxed text-pretty">
              <p>
                Forte d&apos;une expérience de près de {COMPANY.yearsExperience} ans
                auprès des entreprises, nos experts sont des spécialistes dans le
                support, l&apos;accompagnement et la structuration des organisations
                — PME, groupes et projets — dans l&apos;atteinte de l&apos;excellence
                opérationnelle.
              </p>
              <p>
                HMC est un partenaire délivrant un service clé en main de haute valeur
                ajoutée afin de vous accompagner dans la sécurisation de vos décisions
                et de vos choix stratégiques. Notre mission est d&apos;accompagner les
                entreprises à opter pour la stratégie optimale et à sécuriser leur
                activité tout en maîtrisant leurs risques.
              </p>
              <p>
                Nous proposons un accompagnement personnalisé afin de permettre le
                développement des projets suivant leur phase de croissance et de
                maturité.
              </p>
            </div>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 grid sm:grid-cols-2 gap-3"
            >
              {[
                "Service clé en main",
                "Haute valeur ajoutée",
                "Accompagnement personnalisé",
                "Sécurisation des décisions",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}

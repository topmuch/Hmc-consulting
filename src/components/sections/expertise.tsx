"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { EXPERTISE } from "@/lib/site-data";

export function Expertise() {
  return (
    <section id="expertise" className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Expertise"
          title={
            <>
              Trois domaines d&apos;expertise,{" "}
              <span className="italic text-accent">une seule exigence</span>
            </>
          }
          description="Du diagnostic stratégique à la structuration financière, nous couvrons l'ensemble de la chaîne de valeur de l'entreprise avec une vision à la fois stratégique et opérationnelle."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid lg:grid-cols-3 gap-6">
          {EXPERTISE.map((expertise, i) => (
            <motion.div
              key={expertise.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group relative flex flex-col bg-background rounded-2xl border border-border p-7 hover:border-accent/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <expertise.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <span className="font-serif text-5xl font-semibold text-accent/10">
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-5 font-serif text-2xl font-semibold text-foreground">
                {expertise.title}
              </h3>

              <ul className="mt-5 space-y-3 flex-1">
                {expertise.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bandeau image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 relative rounded-2xl overflow-hidden h-56 sm:h-64"
        >
          <img
            src="/expertise-meeting.jpg"
            alt="Dirigeants en réunion stratégique"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 sm:px-12 max-w-xl">
              <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-snug text-balance">
                &ldquo;L&apos;excellence managériale, au service de la création de valeur.&rdquo;
              </p>
              <p className="mt-3 text-sm text-sky-light uppercase tracking-[0.18em]">
                — Notre conviction
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

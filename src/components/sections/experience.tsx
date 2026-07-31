"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { COUNTRIES, COMPANY } from "@/lib/site-data";

export function Experience() {
  return (
    <section
      id="experience"
      className="relative py-20 sm:py-28 bg-navy text-white overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="/africa-map.jpg"
          alt="Carte de l'Afrique"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/70" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeading
              eyebrow="Notre Expérience"
              title={
                <>
                  Une présence en{" "}
                  <span className="italic text-sky-light">Afrique &amp; Océan Indien</span>
                </>
              }
              description={`Expérience significative dans près de ${COMPANY.countriesCount} pays, du Maroc à l'Afrique du Sud, en passant par l'Océan Indien. Une connaissance fine des marchés, des secteurs et des acteurs locaux.`}
              light
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-8"
            >
              <div>
                <div className="font-serif text-4xl font-semibold text-sky-light">
                  +{COMPANY.countriesCount}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/60">
                  Pays couverts
                </div>
              </div>
              <div className="w-px bg-white/15" />
              <div>
                <div className="font-serif text-4xl font-semibold text-sky-light">
                  +{COMPANY.yearsExperience}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/60">
                  Ans d&apos;expérience
                </div>
              </div>
              <div className="w-px bg-white/15" />
              <div>
                <div className="font-serif text-4xl font-semibold text-sky-light">3</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/60">
                  Domaines d&apos;expertise
                </div>
              </div>
            </motion.div>
          </div>

          {/* Country list */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/10 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="h-4 w-4 text-sky-light" />
              <h3 className="font-serif text-lg font-semibold text-white">
                Pays d&apos;intervention
              </h3>
            </div>
            <div className="max-h-72 overflow-y-auto pr-2 custom-scroll">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {COUNTRIES.map((country, i) => (
                  <motion.li
                    key={country}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-light shrink-0" />
                    {country}
                  </motion.li>
                ))}
              </ul>
            </div>
            <p className="mt-5 pt-5 border-t border-white/10 text-xs text-white/50">
              Maroc, Sénégal, Côte d&apos;Ivoire, Ghana, Bénin, Togo, Niger, Nigéria, Cameroun,
              Guinée Conakry, Guinée Équatoriale, Gabon, Afrique du Sud, Île Maurice, Ouganda,
              Tchad, Tunisie, Angola…
            </p>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(80, 176, 224, 0.4);
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}

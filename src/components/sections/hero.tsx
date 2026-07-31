"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { COMPANY } from "@/lib/site-data";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden bg-charcoal">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-resort.jpg"
          alt="Résort hôtelier de luxe au coucher du soleil"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/65 to-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-light backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Consulting stratégique hôtelier
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] text-white text-balance"
          >
            Partenaire de votre{" "}
            <span className="italic text-gold-light">développement stratégique</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed text-pretty"
          >
            HMC est un cabinet de consulting stratégique et d&apos;accompagnement dédié au
            secteur hôtelier et immobilier, du segment Haut de Gamme (Luxe) à l&apos;économie.
            Nous sécurisons votre activité tout en maîtrisant vos risques.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-gold text-charcoal hover:bg-gold-light group"
            >
              <Link href="#services">
                Découvrir nos services
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="#contact">Nous rencontrer</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 max-w-2xl"
          >
            <Stat value={`+${COMPANY.yearsExperience}`} label="ans d'expérience" />
            <Stat value={`+${COMPANY.countriesCount}`} label="pays couverts" />
            <Stat
              value="Luxe → Éco"
              label="tous segments"
              className="col-span-2 sm:col-span-1"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom geography hint */}
      <div className="absolute bottom-6 left-0 right-0 z-10 hidden md:flex justify-center">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          Afrique &amp; Océan Indien
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="font-serif text-3xl sm:text-4xl font-semibold text-gold-light">
        {value}
      </div>
      <div className="mt-1 text-xs sm:text-sm uppercase tracking-wider text-white/70">
        {label}
      </div>
    </div>
  );
}

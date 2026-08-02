"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/sections/section-heading";
import { TESTIMONIALS } from "@/lib/testimonials-data";

type TestimonialData = {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  image: string;
  project: string;
};

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(TESTIMONIALS);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;

  // Fetch testimonials from API
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
        }
      } catch {
        // Fallback to static data is already set as default
      }
    }
    fetchTestimonials();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext, isPaused]);

  if (total === 0) return null;

  const testimonial = testimonials[current];

  return (
    <section className="py-20 sm:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Témoignages"
          title={
            <>
              Ils nous font <span className="italic text-accent">confiance</span>
            </>
          }
          description="Découvrez ce que nos clients disent de notre accompagnement et de notre engagement à leurs côtés."
          align="center"
          className="mx-auto"
        />

        <div
          className="mt-14 relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main card */}
          <div className="relative overflow-hidden rounded-2xl bg-navy p-8 sm:p-12 text-white shadow-lg min-h-[340px] flex items-center">
            {/* Decorative gradients */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sky/25 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-sky/10 blur-2xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative w-full"
              >
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
                  {/* Photo */}
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-accent/40 ring-4 ring-accent/10">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center sm:text-left">
                    <Quote className="h-8 w-8 text-accent/40 mb-4 mx-auto sm:mx-0" strokeWidth={1.5} />
                    <blockquote className="italic text-white/85 leading-relaxed text-base sm:text-lg">
                      &laquo;&nbsp;{testimonial.content}&nbsp;&raquo;
                    </blockquote>
                    <div className="mt-6">
                      <p className="font-medium text-white text-base">{testimonial.name}</p>
                      <p className="text-sm text-sky-light/80">
                        {testimonial.role} — {testimonial.company}
                      </p>
                      <p className="mt-2 inline-block text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {testimonial.project}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:-translate-x-full h-10 w-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center text-navy hover:bg-accent hover:text-accent-foreground transition-colors z-10"
            aria-label="Témoignage précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-full h-10 w-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center text-navy hover:bg-accent hover:text-accent-foreground transition-colors z-10"
            aria-label="Témoignage suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-accent"
                    : "w-2.5 bg-accent/30 hover:bg-accent/50"
                }`}
                aria-label={`Aller au témoignage ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

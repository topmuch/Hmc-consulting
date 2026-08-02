"use client";

import type { LucideIcon } from "lucide-react";

export type ServiceData = {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
};

export function ServiceCard({
  service,
  index,
  animated = false,
}: {
  service: ServiceData;
  index: number;
  animated?: boolean;
}) {
  const Wrapper = animated
    ? require("framer-motion").motion.div
    : "div";

  const animationProps = animated
    ? {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.55, delay: index * 0.12 },
      }
    : {};

  return (
    <Wrapper
      key={service.title}
      className="group relative overflow-hidden rounded-2xl bg-navy p-7 text-white shadow-lg"
      {...animationProps}
    >
      {/* Decorative gradient */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sky/25 blur-3xl group-hover:bg-sky/35 transition-colors" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-sky-light border border-white/10">
            <service.icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <span className="font-serif text-5xl font-semibold text-white/10">
            0{index + 1}
          </span>
        </div>
        <h3 className="mt-5 font-serif text-2xl font-semibold">{service.title}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sky-light/90">
          {service.subtitle}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/75">
          {service.description}
        </p>
      </div>
    </Wrapper>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "@/lib/products-data";

export function ProductCard({
  product,
  animated = false,
}: {
  product: Product;
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
        transition: { duration: 0.55, delay: 0.08 },
      }
    : {};

  return (
    <Wrapper {...animationProps}>
      <Link
        href={`/?product=${product.id}`}
        className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300"
      >
        {/* Image / gradient header */}
        <div className={`relative h-44 bg-gradient-to-br ${product.gradient} overflow-hidden`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover mix-blend-overlay opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white">
            <product.icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <span className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-medium text-white">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-serif text-xl font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-accent">
            {product.tagline}
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
            {product.description}
          </p>

          {/* Top benefits */}
          <ul className="mt-4 space-y-1.5">
            {product.benefits.slice(0, 2).map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" strokeWidth={2.5} />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent">
            Voir le produit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </Wrapper>
  );
}

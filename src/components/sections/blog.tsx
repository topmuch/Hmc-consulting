"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { formatDate } from "@/components/dashboard/views/_shared";

/* ── Post type from API ── */
type Post = {
  id: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  published: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

/* ── Default blog images (rotated for visual variety) ── */
const BLOG_IMAGES = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
];

/* ── Estimate read time from content ── */
function estimateReadTime(content: string | null): string {
  if (!content) return "3 min";
  const words = content.split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(words / 200));
  return `${minutes} min`;
}

/* ── Derive a category from title keywords ── */
function deriveCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("digital") || t.includes("intelligence") || t.includes("ia"))
    return "Innovation";
  if (t.includes("management") || t.includes("transition") || t.includes("changement"))
    return "Management";
  if (t.includes("financ") || t.includes("structuration") || t.includes("invest"))
    return "Finance";
  if (t.includes("gouvernance") || t.includes("conseil"))
    return "Conseil";
  return "Conseil";
}

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setPosts(data.posts.slice(0, 3));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Blog & Actualités"
          title={
            <>
              Nos dernières <span className="italic text-accent">publications</span>
            </>
          }
          description="Analyses, conseils et retours d'expérience pour accompagner le développement de votre entreprise et anticiper les évolutions des marchés."
          align="center"
          className="mx-auto"
        />

        {/* Blog cards grid */}
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loading
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-muted" />
                <div className="flex flex-col flex-1 p-6 gap-3">
                  <div className="h-3 w-32 bg-muted rounded" />
                  <div className="h-5 w-full bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-sm">
                Aucun article publié pour le moment. Revenez bientôt !
              </p>
            </div>
          ) : (
            posts.map((post, idx) => (
              <article
                key={post.id}
                className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.imageUrl || BLOG_IMAGES[idx % BLOG_IMAGES.length]}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-medium text-white">
                    {deriveCategory(post.title)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Date & read time */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {estimateReadTime(post.content)}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-lg font-semibold text-foreground leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                    {post.content
                      ? post.content.slice(0, 180) + (post.content.length > 180 ? "…" : "")
                      : "Découvrez notre analyse et nos recommandations sur ce sujet."}
                  </p>

                  <Link
                    href={`/?blog=${post.id}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Lire la suite
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Link to full blog page */}
        <div className="mt-10 text-center">
          <Link
            href="/?page=blog"
            className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
          >
            Voir tous les articles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

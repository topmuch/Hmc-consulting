"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
  Home,
  User,
  Linkedin,
  Twitter,
  Link2,
  Check,
} from "lucide-react";
import { PageLayout } from "@/components/pages/page-layout";
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

/* ── Default blog images ── */
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

/* ── Simple markdown-like rendering ── */
function renderContent(content: string | null): React.ReactNode {
  if (!content) {
    return (
      <p className="text-muted-foreground italic">
        Cet article n&apos;a pas encore de contenu.
      </p>
    );
  }

  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/);

  return paragraphs.map((paragraph, i) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return null;

    // Check for headings (lines starting with #)
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="font-serif text-xl font-semibold text-foreground mt-8 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="font-serif text-2xl font-semibold text-foreground mt-10 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h1 key={i} className="font-serif text-3xl font-semibold text-foreground mt-12 mb-4">
          {trimmed.slice(2)}
        </h1>
      );
    }

    // Check for bullet lists (lines starting with - or *)
    const lines = trimmed.split("\n");
    const isList = lines.every((line) => /^[\s]*[-*]\s/.test(line));

    if (isList) {
      return (
        <ul key={i} className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed mb-4">
          {lines.map((line, j) => (
            <li key={j}>{line.replace(/^[\s]*[-*]\s/, "")}</li>
          ))}
        </ul>
      );
    }

    // Regular paragraph — preserve line breaks within
    return (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {trimmed.split("\n").map((line, j, arr) => (
          <span key={j}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

export function BlogDetailView({
  postId,
  onGoDashboard,
}: {
  postId: string;
  onGoDashboard?: () => void;
}) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!postId) return;

    Promise.all([
      fetch(`/api/posts/${postId}`).then((r) => r.json()),
      fetch("/api/posts").then((r) => r.json()),
    ])
      .then(([postRes, postsRes]) => {
        if (postRes.ok) {
          setPost(postRes.post);
        }
        if (postsRes.ok) {
          // Get 3 recent posts excluding current one
          setRelatedPosts(
            postsRes.posts
              .filter((p: Post) => p.id !== postId)
              .slice(0, 3)
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const handleShareLinkedIn = () => {
    const url = window.location.href;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleShareTwitter = () => {
    const url = window.location.href;
    const text = post?.title || "";
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const goBlog = () => {
    router.push("/?page=blog", { scroll: false });
  };

  if (loading) {
    return (
      <PageLayout onGoDashboard={onGoDashboard}>
        <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary/50 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4 max-w-3xl">
              <div className="h-4 w-48 bg-muted rounded" />
              <div className="h-10 w-3/4 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout onGoDashboard={onGoDashboard}>
        <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary/50 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link href="/" className="flex items-center gap-1 hover:text-accent transition-colors">
                <Home className="h-3.5 w-3.5" />
                Accueil
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <button onClick={goBlog} className="hover:text-accent transition-colors">
                Blog
              </button>
            </nav>
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Article introuvable.</p>
              <button
                onClick={goBlog}
                className="mt-4 inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au blog
              </button>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  const category = deriveCategory(post.title);
  const heroImage = post.imageUrl || BLOG_IMAGES[post.id.charCodeAt(0) % BLOG_IMAGES.length];

  return (
    <PageLayout onGoDashboard={onGoDashboard}>
      {/* ── Banner with breadcrumb ── */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary/50 border-b border-border overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link href="/" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={goBlog} className="hover:text-accent transition-colors">
              Blog
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
              {post.title}
            </span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {category}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight text-balance">
              {post.title}
            </h1>

            {/* Author info & date */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent font-medium text-xs">
                  {post.authorName
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{post.authorName}</div>
                  <div className="text-xs text-muted-foreground">Auteur</div>
                </div>
              </div>
              <span className="hidden sm:inline text-muted-foreground/40">|</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {estimateReadTime(post.content)} de lecture
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Hero image ── */}
      <section className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[21/9]"
          >
            <Image
              src={heroImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── Article content ── */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <article className="prose-custom">
              {renderContent(post.content)}
            </article>

            {/* Share buttons */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-sm font-medium text-foreground">Partager cet article</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareLinkedIn}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-card text-muted-foreground hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-colors"
                    aria-label="Partager sur LinkedIn"
                  >
                    <Linkedin className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={handleShareTwitter}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-card text-muted-foreground hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-colors"
                    aria-label="Partager sur Twitter"
                  >
                    <Twitter className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-card text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors"
                    aria-label="Copier le lien"
                  >
                    {copied ? <Check className="h-4.5 w-4.5 text-emerald-500" /> : <Link2 className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Back to blog link */}
            <div className="mt-8">
              <button
                onClick={goBlog}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au blog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related posts ── */}
      {relatedPosts.length > 0 && (
        <section className="py-16 sm:py-20 bg-secondary/40 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                À lire aussi
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-8">
              Articles similaires
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, idx) => (
                <article
                  key={relatedPost.id}
                  className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={BLOG_IMAGES[idx % BLOG_IMAGES.length]}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-medium text-white">
                      {deriveCategory(relatedPost.title)}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(relatedPost.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {estimateReadTime(relatedPost.content)}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-lg font-semibold text-foreground leading-snug line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                      {relatedPost.content
                        ? relatedPost.content.slice(0, 180) + (relatedPost.content.length > 180 ? "…" : "")
                        : "Découvrez notre analyse et nos recommandations sur ce sujet."}
                    </p>
                    <Link
                      href={`/?blog=${relatedPost.id}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      Lire la suite
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}

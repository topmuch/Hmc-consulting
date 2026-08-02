import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-serif font-bold text-accent">404</div>
        <h1 className="mt-4 font-serif text-2xl sm:text-3xl font-semibold text-foreground">
          Page introuvable
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
          Vérifiez l&apos;adresse ou retournez à l&apos;accueil.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

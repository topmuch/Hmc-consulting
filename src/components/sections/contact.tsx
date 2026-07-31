"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, User, Briefcase, Send, CheckCircle2, Loader2 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { COMPANY } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Échec de l'envoi");
      }
      setDone(true);
      setForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "",
        message: "",
      });
      toast({
        title: "Message envoyé",
        description: "Merci. Nous revenons vers vous très rapidement.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-charcoal text-white overflow-hidden">
      {/* Decorative chess background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="/contact-chess.jpg"
          alt=""
          className="h-full w-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/75" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: info */}
          <div>
            <SectionHeading
              eyebrow="Contact"
              title={
                <>
                  Parlons de votre <span className="italic text-gold-light">projet</span>
                </>
              }
              description="Une question, un projet d'acquisition, de rénovation ou de structuration ? Notre équipe vous répond avec la confidentialité et l'attention que méritent vos enjeux."
              light
            />

            <div className="mt-10 space-y-5">
              <ContactCard
                icon={<User className="h-5 w-5" />}
                label="Interlocuteur"
                value={`${COMPANY.partner}`}
                sub={COMPANY.partnerRole}
              />
              <ContactCard
                icon={<Phone className="h-5 w-5" />}
                label="Téléphone"
                value={COMPANY.phone}
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              />
              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                label="E-mail"
                value={COMPANY.email}
                href={`mailto:${COMPANY.email}`}
              />
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-gold-light/90">
              <span className="h-px w-8 bg-gold-light/50" />
              Afrique &amp; Océan Indien
            </div>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6 sm:p-8"
          >
            {done ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold-light">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold">Message envoyé</h3>
                <p className="mt-2 text-sm text-white/70 max-w-sm">
                  Merci pour votre confiance. Notre équipe revient vers vous dans les plus
                  brefs délais.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-white/30 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setDone(false)}
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nom complet *">
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Votre nom"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-gold-light"
                    />
                  </Field>
                  <Field label="E-mail *">
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="vous@exemple.com"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-gold-light"
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Société">
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="Votre structure"
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-gold-light"
                      />
                    </div>
                  </Field>
                  <Field label="Téléphone">
                    <Input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+221 ..."
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-gold-light"
                    />
                  </Field>
                </div>

                <Field label="Sujet *">
                  <Input
                    required
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder="Objet de votre demande"
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-gold-light"
                  />
                </Field>

                <Field label="Message *">
                  <Textarea
                    required
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Décrivez votre projet ou votre demande…"
                    rows={5}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-gold-light resize-none"
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold text-charcoal hover:bg-gold-light font-medium group"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      Envoyer le message
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-white/40">
                  En envoyant ce formulaire, vous acceptez d&apos;être recontacté par HMC.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wider text-white/70">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const content = (
    <div className="group flex items-center gap-4 rounded-xl bg-white/[0.04] border border-white/10 p-4 hover:border-gold-light/40 hover:bg-white/[0.07] transition-all">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/15 text-gold-light shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.16em] text-white/50">{label}</div>
        <div className="text-base font-medium text-white truncate">{value}</div>
        {sub && <div className="text-xs text-gold-light/80">{sub}</div>}
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, Briefcase, Send, CheckCircle2, Loader2, Paperclip } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { COMPANY } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

export function Contact() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    productId: "",
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
        body: JSON.stringify({ ...form, attachmentUrl }),
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
        productId: "",
      });
      setAttachmentUrl(null);
      toast({
        title: t("contact.successTitle"),
        description: t("contact.successDescription"),
      });
    } catch (err) {
      toast({
        title: t("common.send") + " — " + "Erreur",
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-navy text-white overflow-hidden">
      {/* Decorative chess background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/contact-chess.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/75" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: info */}
          <div>
            <SectionHeading
              eyebrow="Contact"
              title={
                <>
                  {t("contact.title")} <span className="italic text-sky-light">{t("contact.titleAccent")}</span>
                </>
              }
              description={t("contact.description")}
              light
            />

            <div className="mt-10 space-y-5">
              <ContactCard
                icon={<User className="h-5 w-5" />}
                label={t("contact.interlocutorLabel")}
                value="HMC"
                sub="Horizon Management Consulting"
              />
              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                label={t("contact.emailCardLabel")}
                value={COMPANY.email}
                href={`mailto:${COMPANY.email}`}
              />
            </div>

            {/* Google Maps */}
            <div className="mt-8 rounded-xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123208.04086554913!2d-17.49336885!3d14.6936803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172f5b3c5bb71%3A0xbfc6c55c5e0e7f3e!2sDakar%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HMC — Dakar, Sénégal"
                className="w-full"
              />
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-sky-light/90">
              <span className="h-px w-8 bg-sky-light/50" />
              {t("contact.locationSubtitle")}
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky/20 text-sky-light">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold">{t("contact.successTitle")}</h3>
                <p className="mt-2 text-sm text-white/70 max-w-sm">
                  {t("contact.successDescription")}
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-white/30 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setDone(false)}
                >
                  {t("contact.sendAnother")}
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("contact.nameLabel")}>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder={t("contact.namePlaceholder")}
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-sky-light"
                    />
                  </Field>
                  <Field label={t("contact.emailLabel")}>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder={t("contact.emailPlaceholder")}
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-sky-light"
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("contact.companyLabel")}>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder={t("contact.companyPlaceholder")}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-sky-light"
                      />
                    </div>
                  </Field>
                  <Field label={t("contact.phoneLabel")}>
                    <Input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder={t("contact.phonePlaceholder")}
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-sky-light"
                    />
                  </Field>
                </div>

                <Field label={t("contact.productLabel")}>
                  <select
                    value={form.productId}
                    onChange={(e) => update("productId", e.target.value)}
                    className="w-full rounded-md bg-white/5 border border-white/15 text-white px-3 py-2 text-sm focus-visible:border-sky-light focus-visible:outline-none [&>option]:bg-navy [&>option]:text-white"
                  >
                    <option value="">{t("contact.noProductOption")}</option>
                    <option value="qrbags">QRbags — Traçabilité de bagages</option>
                    <option value="qrtags">QRtags — Traçabilité d'objets</option>
                    <option value="qrtags-entreprise">QRtags Entreprise — Objets trouvés pro</option>
                    <option value="qrtrans">QRtrans — Suivi de colis via WhatsApp</option>
                    <option value="verifscan">VerifScan — Traçabilité agroalimentaire</option>
                    <option value="myrest">MyRest — Menu digital restaurant</option>
                  </select>
                </Field>

                <Field label={t("contact.subjectLabel")}>
                  <Input
                    required
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder={t("contact.subjectPlaceholder")}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-sky-light"
                  />
                </Field>

                <Field label={t("contact.messageLabel")}>
                  <Textarea
                    required
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder={t("contact.messagePlaceholder")}
                    rows={5}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-sky-light resize-none"
                  />
                </Field>

                <Field label={t("contact.attachmentLabel")}>
                  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Paperclip className="h-4 w-4 text-white/40" />
                      <span className="text-xs text-white/50">{t("contact.attachmentHint")}</span>
                    </div>
                    <FileUpload
                      onUploadComplete={(url) => setAttachmentUrl(url)}
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                      className="[&_div]:border-white/10 [&_div]:bg-white/[0.03] [&_div]:hover:border-sky-light/40 [&_p]:text-white/50 [&_div]:text-white/70"
                    />
                  </div>
                </Field>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-sky text-navy hover:bg-sky-light font-medium group"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("contact.sendingButton")}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      {t("contact.submitButton")}
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-white/40">
                  {t("contact.consentText")}
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
    <div className="group flex items-center gap-4 rounded-xl bg-white/[0.04] border border-white/10 p-4 hover:border-sky-light/40 hover:bg-white/[0.07] transition-all">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky/15 text-sky-light shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.16em] text-white/50">{label}</div>
        <div className="text-base font-medium text-white truncate">{value}</div>
        {sub && <div className="text-xs text-sky-light/80">{sub}</div>}
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

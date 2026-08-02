"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

type BookingForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  preferredDate: string;
  preferredTime: string;
  subject: string;
};

export function AppointmentBooking() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    company: "",
    preferredDate: "",
    preferredTime: "",
    subject: "",
  });

  const update = (key: keyof BookingForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      // Step 1: Create or find a lead with this email
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          company: form.company || null,
          source: "website",
          status: "new",
        }),
      });

      let leadId: string | null = null;

      if (leadRes.ok) {
        const leadData = await leadRes.json();
        leadId = leadData.lead?.id || null;
      }

      // If lead creation failed (maybe already exists), try to find it
      if (!leadId) {
        const searchRes = await fetch(
          `/api/leads?search=${encodeURIComponent(form.email)}`,
          { cache: "no-store" }
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const existing = searchData.leads?.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (l: any) => l.email.toLowerCase() === form.email.toLowerCase()
          );
          leadId = existing?.id || null;
        }
      }

      if (!leadId) {
        throw new Error(t("appointment.errorLead"));
      }

      // Step 2: Create appointment
      const apptRes = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          date: form.preferredDate,
          time: form.preferredTime || null,
          contactName: form.name,
          location: form.company || null,
          status: "scheduled",
        }),
      });

      const apptData = await apptRes.json();
      if (!apptRes.ok || !apptData.ok) {
        throw new Error(apptData?.error || "Échec de la réservation");
      }

      setDone(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        preferredDate: "",
        preferredTime: "",
        subject: "",
      });
      toast({
        title: t("appointment.toastTitle"),
        description: t("appointment.toastDescription"),
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

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <section
      id="appointment-booking"
      className="relative py-20 sm:py-28 bg-navy-dark text-white overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-light rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: info */}
          <div>
            <SectionHeading
              eyebrow={t("appointment.eyebrow")}
              title={
                <>
                  {t("appointment.title1")} <span className="italic text-sky-light">{t("appointment.title2")}</span>
                </>
              }
              description={t("appointment.description")}
              light
            />

            <div className="mt-10 space-y-5">
              <BookingInfoCard
                icon={<Calendar className="h-5 w-5" />}
                label={t("appointment.availabilityLabel")}
                value={t("appointment.availabilityValue")}
              />
              <BookingInfoCard
                icon={<Clock className="h-5 w-5" />}
                label={t("appointment.durationLabel")}
                value={t("appointment.durationValue")}
              />
              <BookingInfoCard
                icon={<Mail className="h-5 w-5" />}
                label={t("appointment.confirmationLabel")}
                value={t("appointment.confirmationValue")}
              />
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-sky-light/90">
              <span className="h-px w-8 bg-sky-light/50" />
              {t("appointment.freeText")}
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
                <h3 className="mt-5 font-serif text-2xl font-semibold">
                  {t("appointment.successTitle")}
                </h3>
                <p className="mt-2 text-sm text-white/70 max-w-sm">
                  {t("appointment.successDescription")}
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-white/30 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setDone(false)}
                >
                  {t("appointment.bookAnother")}
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("appointment.nameLabel")}>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder={t("appointment.namePlaceholder")}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-sky-light"
                      />
                    </div>
                  </Field>
                  <Field label={t("appointment.emailLabel")}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder={t("appointment.emailPlaceholder")}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-sky-light"
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("appointment.phoneLabel")}>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder={t("appointment.phonePlaceholder")}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-sky-light"
                      />
                    </div>
                  </Field>
                  <Field label={t("appointment.companyLabel")}>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder={t("appointment.companyPlaceholder")}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-sky-light"
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("appointment.dateLabel")}>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        required
                        type="date"
                        min={today}
                        value={form.preferredDate}
                        onChange={(e) => update("preferredDate", e.target.value)}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-sky-light [color-scheme:dark]"
                      />
                    </div>
                  </Field>
                  <Field label={t("appointment.timeLabel")}>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        type="time"
                        value={form.preferredTime}
                        onChange={(e) => update("preferredTime", e.target.value)}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-sky-light [color-scheme:dark]"
                      />
                    </div>
                  </Field>
                </div>

                <Field label={t("appointment.subjectLabel")}>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <Textarea
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      placeholder={t("appointment.subjectPlaceholder")}
                      rows={4}
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-sky-light resize-none"
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
                      {t("appointment.submittingButton")}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      {t("appointment.submitButton")}
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-white/40">
                  {t("appointment.consentText")}
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

function BookingInfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-xl bg-white/[0.04] border border-white/10 p-4 hover:border-sky-light/40 hover:bg-white/[0.07] transition-all">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky/15 text-sky-light shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.16em] text-white/50">
          {label}
        </div>
        <div className="text-base font-medium text-white truncate">{value}</div>
      </div>
    </div>
  );
}

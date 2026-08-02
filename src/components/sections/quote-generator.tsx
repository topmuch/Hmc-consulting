"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Package,
  User,
  Clock,
  FileText,
  Wallet,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { PRODUCTS } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

const TOTAL_STEPS = 4;

const TIMELINE_OPTIONS = [
  "Moins de 1 mois",
  "1-3 mois",
  "3-6 mois",
  "6+ mois",
];

const BUDGET_OPTIONS = [
  "Moins de 500K FCFA",
  "500K-1M FCFA",
  "1M-5M FCFA",
  "5M+ FCFA",
];

type FormData = {
  productIds: string[];
  description: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  timeline: string;
  estimatedBudget: string;
};

export function QuoteGenerator() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormData>({
    productIds: [],
    description: "",
    name: "",
    email: "",
    company: "",
    phone: "",
    timeline: "",
    estimatedBudget: "",
  });

  const toggleProduct = (productId: string) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(productId)
        ? f.productIds.filter((id) => id !== productId)
        : [...f.productIds, productId],
    }));
  };

  const update = (key: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canProceed = () => {
    switch (step) {
      case 1:
        return form.productIds.length > 0;
      case 2:
        return (
          form.description.trim().length >= 10 &&
          form.timeline !== "" &&
          form.estimatedBudget !== ""
        );
      case 3:
        return form.name.trim() !== "" && form.email.trim() !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Échec de l'envoi");
      }
      setDone(true);
      toast({
        title: t("quote.successTitle"),
        description: t("quote.successDescription"),
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

  const selectedProductNames = form.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  if (done) {
    return (
      <section className="py-20 sm:py-28 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 font-serif text-3xl sm:text-4xl font-semibold text-foreground"
              >
                {t("quote.successTitle")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-base text-muted-foreground max-w-md"
              >
                {t("quote.successDescription")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="outline"
                  className="mt-8"
                  onClick={() => {
                    setDone(false);
                    setStep(1);
                    setForm({
                      productIds: [],
                      description: "",
                      name: "",
                      email: "",
                      company: "",
                      phone: "",
                      timeline: "",
                      estimatedBudget: "",
                    });
                  }}
                >
                  {t("quote.newRequest")}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("quote.eyebrow")}
          title={
            <>
              {t("quote.title1")}{" "}
              <span className="italic text-accent">{t("quote.title2")}</span>
            </>
          }
          description={t("quote.description")}
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                {step} / {TOTAL_STEPS}
              </span>
              <span className="text-xs font-medium text-accent">
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <Progress
              value={(step / TOTAL_STEPS) * 100}
              className="h-2"
            />
            <div className="flex items-center justify-between mt-3">
              {[
                { n: 1, label: t("quote.productsLabel"), icon: Package },
                { n: 2, label: t("quote.needLabel"), icon: FileText },
                { n: 3, label: t("quote.infoLabel"), icon: User },
                { n: 4, label: t("quote.summaryLabel"), icon: CheckCircle2 },
              ].map((s) => (
                <div key={s.n} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      step >= s.n
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step > s.n ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      s.n
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] hidden sm:block",
                      step >= s.n
                        ? "text-accent font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <StepWrapper key="step1">
                    <StepTitle
                      icon={<Package className="h-5 w-5" />}
                      title={t("quote.step1Title")}
                      description={t("quote.step1Description")}
                    />
                    <div className="mt-6 grid sm:grid-cols-2 gap-3">
                      {PRODUCTS.map((product) => {
                        const isSelected = form.productIds.includes(
                          product.id
                        );
                        return (
                          <button
                            key={product.id}
                            onClick={() => toggleProduct(product.id)}
                            className={cn(
                              "relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                              isSelected
                                ? "border-accent bg-accent/5 shadow-sm ring-1 ring-accent/30"
                                : "border-border hover:border-accent/40 hover:bg-accent/5"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                                isSelected
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <product.icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm text-foreground">
                                {product.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {product.tagline}
                              </div>
                            </div>
                            <div className="absolute top-3 right-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleProduct(product.id)}
                                className={cn(
                                  isSelected
                                    ? "border-accent bg-accent text-accent-foreground"
                                    : ""
                                )}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {form.productIds.length > 0 && (
                      <p className="mt-4 text-xs text-accent font-medium">
                        {form.productIds.length} {form.productIds.length > 1 ? t("quote.selectedProducts") : t("quote.selectedProduct")}
                      </p>
                    )}
                  </StepWrapper>
                )}

                {step === 2 && (
                  <StepWrapper key="step2">
                    <StepTitle
                      icon={<FileText className="h-5 w-5" />}
                      title={t("quote.step2Title")}
                      description={t("quote.step2Description")}
                    />
                    <div className="mt-6 space-y-5">
                      <Field label={t("quote.descriptionLabel")}>
                        <Textarea
                          required
                          value={form.description}
                          onChange={(e) => update("description", e.target.value)}
                          placeholder={t("quote.descriptionPlaceholder")}
                          rows={5}
                          className="resize-none"
                        />
                      </Field>
                      <p className="text-xs text-muted-foreground -mt-2">
                        {t("quote.descriptionHint")}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label={t("quote.timelineLabel")}>
                          <select
                            value={form.timeline}
                            onChange={(e) => update("timeline", e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
                          >
                            <option value="">{t("quote.selectOption")}</option>
                            {TIMELINE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label={t("quote.budgetLabel")}>
                          <select
                            value={form.estimatedBudget}
                            onChange={(e) =>
                              update("estimatedBudget", e.target.value)
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
                          >
                            <option value="">{t("quote.selectOption")}</option>
                            {BUDGET_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                    </div>
                  </StepWrapper>
                )}

                {step === 3 && (
                  <StepWrapper key="step3">
                    <StepTitle
                      icon={<User className="h-5 w-5" />}
                      title={t("quote.step3Title")}
                      description={t("quote.step3Description")}
                    />
                    <div className="mt-6 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label={t("quote.fullNameLabel")}>
                          <Input
                            required
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Votre nom"
                          />
                        </Field>
                        <Field label={t("quote.emailLabel")}>
                          <Input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="vous@exemple.com"
                          />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label={t("quote.companyLabel")}>
                          <Input
                            value={form.company}
                            onChange={(e) => update("company", e.target.value)}
                            placeholder="Votre entreprise"
                          />
                        </Field>
                        <Field label={t("quote.phoneLabel")}>
                          <Input
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="+221 ..."
                          />
                        </Field>
                      </div>
                    </div>
                  </StepWrapper>
                )}

                {step === 4 && (
                  <StepWrapper key="step4">
                    <StepTitle
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      title={t("quote.step5Title")}
                      description={t("quote.step5Description")}
                    />
                    <div className="mt-6 space-y-4">
                      <ReviewRow
                        label={t("quote.reviewProducts")}
                        value={selectedProductNames || form.productIds.join(", ")}
                      />
                      <ReviewRow label={t("quote.reviewDescription")} value={form.description} />
                      <ReviewRow label={t("quote.reviewTimeline")} value={form.timeline} />
                      <ReviewRow
                        label={t("quote.reviewBudget")}
                        value={form.estimatedBudget}
                      />
                      <div className="border-t border-border my-2" />
                      <ReviewRow label={t("quote.reviewName")} value={form.name} />
                      <ReviewRow label={t("quote.reviewEmail")} value={form.email} />
                      {form.company && (
                        <ReviewRow label={t("quote.reviewCompany")} value={form.company} />
                      )}
                      {form.phone && (
                        <ReviewRow label={t("quote.reviewPhone")} value={form.phone} />
                      )}
                    </div>
                    <p className="mt-6 text-xs text-muted-foreground text-center">
                      {t("quote.consentText")}
                    </p>
                  </StepWrapper>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("quote.previous")}
                  </Button>
                ) : (
                  <div />
                )}

                {step < TOTAL_STEPS ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {t("quote.next")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={onSubmit}
                    disabled={submitting || !canProceed()}
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("quote.sending")}
                      </>
                    ) : (
                      <>
                        {t("quote.submit")}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function StepTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          {icon}
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-border last:border-0">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:w-32 shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

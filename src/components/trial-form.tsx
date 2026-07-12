"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { directions } from "@/content/directions";
import { siteConfig } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";

type FormState = {
  name: string;
  phone: string;
  direction: string;
  time: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = { name: "", phone: "", direction: "", time: "" };

const phonePattern = /^[+\d][\d\s\-()]{9,17}$/;

export function TrialForm({ locale }: { locale: AppLocale }) {
  const t = useTranslations("form");
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (values.name.trim().length < 2) {
      next.name = t("nameError");
    }
    if (!phonePattern.test(values.phone.trim())) {
      next.phone = t("phoneError");
    }
    if (!values.direction) {
      next.direction = t("directionError");
    }
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch(siteConfig.trialFormEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setValues(initialState);
    } catch {
      setStatus("idle");
      toast.error(t("toastError"));
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-gold/30 bg-gold/10 px-8 py-14 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold" />
        <h3 className="font-display text-2xl italic text-primary">{t("successHeading")}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/75">
          {t("successMessage")}
        </p>
        <Button
          variant="outline"
          className="mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => setStatus("idle")}
        >
          {t("successRetry")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">{t("nameLabel")}</Label>
        <Input
          id="name"
          name="name"
          placeholder={t("namePlaceholder")}
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">{t("phoneLabel")}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder={t("phonePlaceholder")}
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="direction">{t("directionLabel")}</Label>
        <Select
          value={values.direction}
          onValueChange={(val) => setValues((v) => ({ ...v, direction: val ?? "" }))}
        >
          <SelectTrigger id="direction" className="w-full" aria-invalid={!!errors.direction}>
            <SelectValue placeholder={t("directionPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {directions[locale].map((d) => (
              <SelectItem key={d.id} value={d.title}>
                {d.title}
              </SelectItem>
            ))}
            <SelectItem value={t("consultOption")}>{t("consultOption")}</SelectItem>
          </SelectContent>
        </Select>
        {errors.direction && <p className="text-sm text-destructive">{errors.direction}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="time">{t("timeLabel")}</Label>
        <Input
          id="time"
          name="time"
          placeholder={t("timePlaceholder")}
          value={values.time}
          onChange={(e) => setValues((v) => ({ ...v, time: e.target.value }))}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("submitting")}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> {t("submit")}
          </>
        )}
      </Button>
    </form>
  );
}

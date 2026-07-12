"use client";

import { useState, type FormEvent } from "react";
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

type FormState = {
  name: string;
  phone: string;
  direction: string;
  time: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = { name: "", phone: "", direction: "", time: "" };

const phonePattern = /^[+\d][\d\s\-()]{9,17}$/;

export function TrialForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (values.name.trim().length < 2) {
      next.name = "Укажите, пожалуйста, имя (минимум 2 буквы)";
    }
    if (!phonePattern.test(values.phone.trim())) {
      next.phone = "Проверьте номер телефона, например +7 900 000 00 00";
    }
    if (!values.direction) {
      next.direction = "Выберите направление";
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
      toast.error(
        "Не удалось отправить заявку. Позвоните нам напрямую — мы обязательно ответим.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-gold/30 bg-gold/10 px-8 py-14 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold" />
        <h3 className="font-display text-2xl italic text-primary">Заявка отправлена!</h3>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/75">
          Спасибо! Мы свяжемся с вами в ближайшее время, чтобы согласовать удобную дату
          пробного занятия.
        </p>
        <Button
          variant="outline"
          className="mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => setStatus("idle")}
        >
          Отправить ещё одну заявку
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          name="name"
          placeholder="Как к вам обращаться"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+7 900 000 00 00"
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="direction">Направление</Label>
        <Select
          value={values.direction}
          onValueChange={(val) => setValues((v) => ({ ...v, direction: val ?? "" }))}
        >
          <SelectTrigger id="direction" className="w-full" aria-invalid={!!errors.direction}>
            <SelectValue placeholder="Выберите направление" />
          </SelectTrigger>
          <SelectContent>
            {directions.map((d) => (
              <SelectItem key={d.id} value={d.title}>
                {d.title}
              </SelectItem>
            ))}
            <SelectItem value="Не уверен(а), нужна консультация">
              Не уверен(а), нужна консультация
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.direction && <p className="text-sm text-destructive">{errors.direction}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="time">Удобное время</Label>
        <Input
          id="time"
          name="time"
          placeholder="Например, будни после 17:00"
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
            <Loader2 className="h-4 w-4 animate-spin" /> Отправляем…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Записаться на пробное занятие
          </>
        )}
      </Button>
    </form>
  );
}

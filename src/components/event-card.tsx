import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StudioEvent } from "@/content/events";

const typeStyles: Record<StudioEvent["type"], string> = {
  концерт: "bg-primary text-primary-foreground",
  квартирник: "bg-accent text-accent-foreground",
  лекция: "bg-secondary text-secondary-foreground",
  кинопоказ: "bg-plum-deep text-cream",
};

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function EventCard({ event }: { event: StudioEvent }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full">
        <Image src={event.image} alt={event.title} fill className="object-cover" />
        <Badge className={`absolute left-4 top-4 capitalize ${typeStyles[event.type]}`}>
          {event.type}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-4 text-sm text-foreground/60">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-gold" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gold" />
            {event.time}
          </span>
        </div>
        <h3 className="font-display text-xl italic text-primary">{event.title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-foreground/75">{event.description}</p>
        <Button
          asChild
          className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <a href="#kontakty">Записаться</a>
        </Button>
      </div>
    </article>
  );
}

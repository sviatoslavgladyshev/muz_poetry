import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StudioEvent } from "@/content/events";
import { formatEventDate } from "@/content/events";
import type { AppLocale } from "@/i18n/routing";
import { publicAssetPath } from "@/lib/utils";

const typeStyles: Record<StudioEvent["type"], string> = {
  concert: "bg-primary text-primary-foreground",
  kvartirnik: "bg-accent text-accent-foreground",
  lecture: "bg-secondary text-secondary-foreground",
  cinema: "bg-plum-deep text-cream",
};

export async function EventCard({
  event,
  locale,
}: {
  event: StudioEvent;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "afisha" });

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-[8px] border border-border bg-card py-0 shadow-sm ring-0 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={publicAssetPath(event.image)}
          alt={event.title}
          fill
          className="object-cover"
        />
        <Badge className={`absolute left-4 top-4 capitalize ${typeStyles[event.type]}`}>
          {t(`eventTypes.${event.type}`)}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-4 text-sm text-foreground/60">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-gold" />
            {formatEventDate(event.date, locale)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gold" />
            {event.time}
          </span>
        </div>
        <h3 className="font-display text-xl italic text-primary">{event.title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-foreground/75">{event.description}</p>
        <Button
          render={<a href="#kontakty" />}
          nativeButton={false}
          className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {t("cta")}
        </Button>
      </CardContent>
    </Card>
  );
}

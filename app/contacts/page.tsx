import type { Metadata } from "next";
import { MapPin, Clock, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VENUE_CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Контакты — Koreana BBQ × Zodiak",
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Contacts" title="Как нас найти" className="mb-10" />

      <div className="grid gap-5 sm:grid-cols-3">
        <InfoCard icon={<MapPin className="h-5 w-5" />} title="Адрес" value={VENUE_CONTACT.address} />
        <InfoCard icon={<Clock className="h-5 w-5" />} title="Часы работы" value={VENUE_CONTACT.hoursNote} />
        <InfoCard icon={<Phone className="h-5 w-5" />} title="Телефон" value="Скоро (демо)" />
      </div>

      <div className="mt-10 flex aspect-video items-center justify-center rounded-md border border-charcoal-700 bg-charcoal-900 text-sm text-warmwhite-dim">
        Карта (2GIS / Google Maps / Yandex Maps) — интеграция позже
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-charcoal-700 bg-charcoal-900 p-5">
      <div className="mb-3 text-gold-500">{icon}</div>
      <p className="text-xs uppercase tracking-wide text-warmwhite-dim">{title}</p>
      <p className="mt-1 text-warmwhite">{value}</p>
    </div>
  );
}

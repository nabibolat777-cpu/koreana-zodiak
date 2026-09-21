import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { VENUE_CONTACT } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-charcoal-700">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url(/images/hero-bg.svg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-950/30" />
      <div className="absolute inset-0 bg-radial-fade" />

      <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col items-start justify-center px-4 py-24 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {VENUE_CONTACT.city}
          </p>

          <h1 className="max-w-3xl font-serif text-5xl leading-tight text-warmwhite sm:text-6xl lg:text-7xl">
            KOREANA BBQ <span className="text-gold-500">×</span> ZODIAK
          </h1>

          <p className="mt-6 max-w-xl text-lg text-warmwhite-dim">
            Restaurant. BBQ. Billiard. Everything in one place.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-10 flex flex-wrap gap-4">
          <Link href="/menu">
            <Button size="lg">Explore Menu</Button>
          </Link>
          <Link href="/billiard">
            <Button size="lg" variant="secondary">
              Book a Table
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

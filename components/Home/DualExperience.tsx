import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export function DualExperience() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Discover"
        title="Один адрес — два впечатления"
        align="center"
        className="mb-12"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FadeIn>
          <Link
            href="/menu"
            className="group relative block h-full overflow-hidden rounded-md border border-charcoal-700 bg-gradient-to-br from-burgundy-900 via-charcoal-900 to-charcoal-950 p-10 transition-colors hover:border-gold-600"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
              Restaurant
            </p>
            <h3 className="mt-3 font-serif text-3xl text-warmwhite">KOREANA BBQ</h3>
            <p className="mt-3 max-w-sm text-warmwhite-dim">Experience Korean BBQ</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gold-400">
              Explore Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Link
            href="/billiard"
            className="group relative block h-full overflow-hidden rounded-md border border-charcoal-700 bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-950 p-10 transition-colors hover:border-gold-600"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
              Billiard Club
            </p>
            <h3 className="mt-3 font-serif text-3xl text-warmwhite">ZODIAK</h3>
            <p className="mt-3 max-w-sm text-warmwhite-dim">Play. Relax. Compete.</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gold-400">
              Book a Table
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

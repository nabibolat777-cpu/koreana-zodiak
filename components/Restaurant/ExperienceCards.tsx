import { EXPERIENCE_HIGHLIGHTS } from "@/data/restaurant";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ExperienceCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Why Koreana BBQ"
        title="Restaurant / BBQ Experience"
        className="mb-10"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXPERIENCE_HIGHLIGHTS.map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-charcoal-700 bg-charcoal-900 p-6 transition-colors hover:border-gold-700/50"
          >
            <h3 className="font-serif text-xl text-warmwhite">{item.title}</h3>
            <p className="mt-2 text-sm text-warmwhite-dim">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

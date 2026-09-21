import { Hero } from "@/components/Hero/Hero";
import { DualExperience } from "@/components/Home/DualExperience";
import { RestaurantGallery } from "@/components/Restaurant/RestaurantGallery";
import { BestSellers } from "@/components/BestSellers/BestSellers";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CrossSell } from "@/components/CrossSell/CrossSell";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DualExperience />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Restaurant" title="Koreana BBQ" className="mb-8" />
        <RestaurantGallery />
      </section>

      <BestSellers />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <CrossSell
          eyebrow="After dinner"
          title="Make your evening longer — book a billiard table at Zodiak."
          ctaLabel="Book a Table"
          href="/billiard"
        />
      </section>
    </>
  );
}

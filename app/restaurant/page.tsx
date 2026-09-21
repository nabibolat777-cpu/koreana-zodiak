import type { Metadata } from "next";
import { RestaurantGallery } from "@/components/Restaurant/RestaurantGallery";
import { ExperienceCards } from "@/components/Restaurant/ExperienceCards";
import { RestaurantBookingForm } from "@/components/Booking/RestaurantBookingForm";
import { CrossSell } from "@/components/CrossSell/CrossSell";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Koreana BBQ — Restaurant in Astana",
};

export default function RestaurantPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Restaurant" title="Koreana BBQ" className="mb-8" />
      <RestaurantGallery />

      <div className="my-14">
        <ExperienceCards />
      </div>

      <div className="mb-10">
        <CrossSell
          eyebrow="Make your evening longer"
          title="Book a billiard table at Zodiak after dinner."
          ctaLabel="Book a Table"
          href="/billiard"
        />
      </div>

      <div id="booking">
        <SectionHeading title="Забронировать столик" className="mb-6" />
        <RestaurantBookingForm />
      </div>
    </div>
  );
}

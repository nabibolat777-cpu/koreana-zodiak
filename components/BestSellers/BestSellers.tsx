import { getBestSellers } from "@/data/menu";
import { MenuCard } from "@/components/MenuCard/MenuCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BestSellers() {
  const items = getBestSellers(6);

  return (
    <section id="best-sellers" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Fan favorites" title="Best Sellers" className="mb-8" />

      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <div key={item.id} className="w-64 shrink-0 sm:w-auto">
            <MenuCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

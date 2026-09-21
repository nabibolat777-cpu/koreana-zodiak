import Image from "next/image";
import { RESTAURANT_GALLERY } from "@/data/restaurant";

/** Large photography, minimal text (PRD #10). */
export function RestaurantGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {RESTAURANT_GALLERY.map((img, i) => (
        <div
          key={img.id}
          className={`relative overflow-hidden rounded-md border border-charcoal-700 ${
            i === 0 ? "col-span-2 aspect-[16/9] sm:col-span-2 sm:row-span-2 sm:aspect-auto" : "aspect-square"
          }`}
        >
          <Image
            src={img.src}
            alt={img.label}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}

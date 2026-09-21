import Image from "next/image";
import { Clock, Flame } from "lucide-react";
import type { MenuItem } from "@/types";
import { formatMoney } from "@/lib/time";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-charcoal-700 bg-charcoal-900 transition-colors hover:border-gold-700/60">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.isPopular && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-sm bg-gold-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-charcoal-950">
            <Flame className="h-3 w-3" aria-hidden />
            Best Seller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg text-warmwhite">{item.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-warmwhite-dim">{item.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-charcoal-700 pt-3">
          <span className="font-serif text-lg text-gold-500">
            {formatMoney(item.price, item.currency)}
          </span>
          <span className="flex items-center gap-1 text-xs text-warmwhite-dim">
            <Clock className="h-3.5 w-3.5" aria-hidden />~{item.preparationTime} min
          </span>
        </div>
      </div>
    </article>
  );
}

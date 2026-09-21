import type { Metadata } from "next";
import { BilliardHall } from "@/components/BilliardHall/BilliardHall";
import { CrossSell } from "@/components/CrossSell/CrossSell";

export const metadata: Metadata = {
  title: "Zodiak Billiard Club — Book a Table in Astana",
};

export default function BilliardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
        Billiard Club
      </p>
      <h1 className="mt-2 font-serif text-4xl text-warmwhite sm:text-5xl">ZODIAK</h1>
      <p className="mt-3 max-w-xl text-warmwhite-dim">
        Choose your table. Book your time. Enjoy the game.
      </p>

      <div className="mt-10 mb-8">
        <BilliardHall />
      </div>

      <CrossSell
        eyebrow="Hungry during your game?"
        title="Order from Koreana BBQ"
        ctaLabel="Explore Menu"
        href="/menu"
      />
    </div>
  );
}

import Link from "next/link";
import { VENUE_CONTACT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-charcoal-700 bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-serif text-lg text-warmwhite">
              KOREANA BBQ <span className="text-gold-600">×</span> ZODIAK
            </p>
            <p className="mt-3 max-w-xs text-sm text-warmwhite-dim">
              Ресторан корейского BBQ и бильярдный клуб в одном месте.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
              Контакты
            </p>
            <p className="text-sm text-warmwhite-dim">{VENUE_CONTACT.address}</p>
            <p className="text-sm text-warmwhite-dim">{VENUE_CONTACT.city}</p>
            <p className="mt-2 text-xs text-warmwhite-dim/70">{VENUE_CONTACT.hoursNote}</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
              Разделы
            </p>
            <ul className="space-y-2 text-sm text-warmwhite-dim">
              <li>
                <Link className="hover:text-gold-400" href="/menu">
                  Меню
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/billiard">
                  Zodiak Бильярд
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/account">
                  Мои бронирования
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-charcoal-700 pt-6 text-xs text-warmwhite-dim/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Koreana BBQ × Zodiak. Прототип.</p>
          <p>Astana, Kazakhstan</p>
        </div>
      </div>
    </footer>
  );
}

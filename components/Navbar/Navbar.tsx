"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/Notifications/NotificationBell";
import { clsx } from "@/lib/clsx";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-700/80 bg-charcoal-950/90 backdrop-blur supports-[backdrop-filter]:bg-charcoal-950/75">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-warmwhite hover:text-gold-400 transition-colors"
        >
          KOREANA BBQ <span className="text-gold-600">×</span> ZODIAK
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm uppercase tracking-wide text-warmwhite-dim transition-colors hover:text-gold-400",
                pathname === link.href && "text-gold-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <NotificationBell />
          <Link href="/billiard">
            <Button size="sm">Book Now</Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <NotificationBell />
          <button
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-sm p-2 text-warmwhite hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-charcoal-700 bg-charcoal-950 px-4 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-sm px-2 py-3 text-sm uppercase tracking-wide text-warmwhite-dim hover:bg-charcoal-800 hover:text-gold-400",
                  pathname === link.href && "text-gold-400"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/billiard" onClick={() => setOpen(false)} className="mt-4 block">
            <Button size="md" className="w-full">
              Book Now
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}

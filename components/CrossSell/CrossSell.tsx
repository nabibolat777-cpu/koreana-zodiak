import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Natural, low-pressure cross-sell between the two businesses (PRD #64). */
export function CrossSell({
  eyebrow,
  title,
  ctaLabel,
  href,
}: {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-md border border-gold-800/40 bg-gradient-to-r from-burgundy-950/60 to-charcoal-900 px-5 py-4 transition-colors hover:border-gold-600"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          {eyebrow}
        </p>
        <p className="mt-1 text-sm text-warmwhite">{title}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold-400">
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}

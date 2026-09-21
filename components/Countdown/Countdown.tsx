"use client";

import type { Booking } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { clsx } from "@/lib/clsx";

export function Countdown({ booking }: { booking: Booking }) {
  const { label, isEndingSoon15, isEndingSoon5 } = useCountdown(booking);

  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-warmwhite-dim">Remaining</p>
      <p
        className={clsx(
          "mt-1 font-serif text-4xl tabular-nums tracking-wider sm:text-5xl",
          isEndingSoon5
            ? "text-status-occupied"
            : isEndingSoon15
              ? "text-status-reserved"
              : "text-gold-500"
        )}
        aria-live="polite"
      >
        {label}
      </p>
    </div>
  );
}

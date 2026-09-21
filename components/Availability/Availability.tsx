"use client";

import { useMemo, useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { formatDateChip, upcomingDates } from "@/lib/time";
import { clsx } from "@/lib/clsx";

/**
 * Date selector + hourly timeline (PRD #23). Selecting an available slot
 * hands (date, time) up to the parent so the booking modal can be
 * prefilled — this is the "Select Table → Select Date → Select Time" step
 * of the flow (PRD #24).
 */
export function Availability({
  tableId,
  onSelectSlot,
}: {
  tableId: string;
  onSelectSlot: (date: string, time: string) => void;
}) {
  const { availabilityTimeline } = useBooking();
  const dates = useMemo(() => upcomingDates(6), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  const slots = useMemo(
    () => availabilityTimeline(tableId, selectedDate),
    [availabilityTimeline, tableId, selectedDate]
  );

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        {dates.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={clsx(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
              selectedDate === d
                ? "border-gold-600 bg-gold-600 text-charcoal-950"
                : "border-charcoal-600 text-warmwhite-dim hover:border-gold-700 hover:text-gold-400"
            )}
          >
            {formatDateChip(d)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {slots.map((slot) => (
          <button
            key={slot.time}
            disabled={!slot.available}
            onClick={() => onSelectSlot(selectedDate, slot.time)}
            className={clsx(
              "flex flex-col items-center gap-1 rounded-sm border px-2 py-2.5 text-xs transition-colors",
              slot.available
                ? "border-status-available/40 text-warmwhite hover:border-status-available hover:bg-status-available/10"
                : "cursor-not-allowed border-charcoal-700 text-warmwhite-dim/50"
            )}
          >
            <span className="font-medium">{slot.time}</span>
            <span>{slot.available ? "🟢" : "🔴"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

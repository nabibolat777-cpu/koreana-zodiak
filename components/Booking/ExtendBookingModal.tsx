"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Booking } from "@/types";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { EXTENSION_OPTIONS } from "@/lib/constants";
import { formatMoney } from "@/lib/time";
import { clsx } from "@/lib/clsx";

const LABELS: Record<number, string> = { 30: "+30 min", 60: "+1 hour", 120: "+2 hours" };

/** Extend-booking flow with mock pricing and availability re-check (PRD #34, #63). */
export function ExtendBookingModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const { getTable, extensionPrice, extendBilliardBooking } = useBooking();
  const [minutes, setMinutes] = useState<number>(EXTENSION_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const table = getTable(booking.tableId);
  if (!table) return null;

  const price = extensionPrice(table, minutes);

  function handleConfirm() {
    const result = extendBilliardBooking(booking.id, minutes);
    if (!result.ok) {
      setError(result.error ?? `${table!.name} is booked from ${booking.endTime}.`);
      return;
    }
    setError(null);
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal-950/80 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Продление бронирования"
        className="w-full max-w-sm rounded-t-md border border-charcoal-700 bg-charcoal-900 p-6 shadow-card sm:rounded-md"
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="font-serif text-xl text-warmwhite">Extend Booking</p>
          <button aria-label="Закрыть" onClick={onClose} className="text-warmwhite-dim hover:text-gold-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-warmwhite">Ваше бронирование продлено.</p>
            <p className="text-sm text-warmwhite-dim">
              Новое время окончания: <span className="text-gold-500">{booking.endTime}</span>
            </p>
            <Button onClick={onClose} className="mt-2 w-full">
              Готово
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              {EXTENSION_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMinutes(m)}
                  className={clsx(
                    "flex-1 rounded-sm border px-3 py-2 text-xs font-medium transition-colors",
                    minutes === m
                      ? "border-gold-600 bg-gold-600 text-charcoal-950"
                      : "border-charcoal-600 text-warmwhite-dim hover:border-gold-700"
                  )}
                >
                  {LABELS[m]}
                </button>
              ))}
            </div>

            <p className="font-serif text-2xl text-gold-500">{formatMoney(price, table.currency)}</p>

            {error && <ErrorState title="Extension Failed" description={error} />}

            <Button size="lg" onClick={handleConfirm}>
              Confirm Extension
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { X, CheckCircle2 } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { addMinutes, formatDateChip, formatMoney, formatTimeRange } from "@/lib/time";
import type { BilliardTable } from "@/types";
import { clsx } from "@/lib/clsx";

const DURATIONS = [
  { minutes: 60, label: "1 час" },
  { minutes: 90, label: "1.5 часа" },
  { minutes: 120, label: "2 часа" },
];

/**
 * Full billiard booking flow (PRD #24-#26): duration -> personal info ->
 * confirm -> confirmation, all inside a single modal so the user never
 * loses their place on the table-details page.
 */
export function BilliardBookingModal({
  table,
  date,
  time,
  onClose,
}: {
  table: BilliardTable;
  date: string;
  time: string;
  onClose: () => void;
}) {
  const { createBilliardBooking, checkAvailable } = useBooking();
  const [duration, setDuration] = useState(60);
  const [players, setPlayers] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const stillAvailable = checkAvailable(table.id, date, time, duration);
  const price = Math.round((table.pricePerHour / 60) * duration);

  function handleConfirm() {
    if (!name.trim() || !phone.trim()) {
      setError("Пожалуйста, заполните имя и телефон.");
      return;
    }
    const result = createBilliardBooking({
      tableId: table.id,
      date,
      startTime: time,
      duration,
      numberOfPlayers: players,
      name,
      phone,
      comment,
    });
    if (!result.ok) {
      setError(result.error ?? "This table was just booked by another customer.");
      return;
    }
    setError(null);
    setConfirmedId(result.data?.id ?? null);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal-950/80 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Бронирование стола"
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-md border border-charcoal-700 bg-charcoal-900 p-6 shadow-card sm:max-w-md sm:rounded-md"
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="font-serif text-xl text-warmwhite">
            {confirmedId ? "Booking Confirmed" : table.name}
          </p>
          <button
            aria-label="Закрыть"
            onClick={onClose}
            className="text-warmwhite-dim hover:text-gold-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {confirmedId ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="h-10 w-10 text-status-available" aria-hidden />
            <p className="font-serif text-2xl text-warmwhite">BOOKING CONFIRMED</p>
            <p className="text-warmwhite-dim">{table.name}</p>
            <p className="text-warmwhite-dim">
              {formatDateChip(date)} · {formatTimeRange(time, addMinutes(time, duration))}
            </p>
            <p className="text-sm text-warmwhite-dim">
              {name} · {phone}
            </p>
            <Link href="/account" className="mt-4 w-full">
              <Button className="w-full">View My Booking</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="rounded-sm border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-warmwhite-dim">
              {formatDateChip(date)} · начало в {time}
            </div>

            {!stillAvailable && (
              <ErrorState
                title="Table Unavailable"
                description="This table was just booked by another customer. Please choose another time."
              />
            )}

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-warmwhite-dim">
                Продолжительность
              </p>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.minutes}
                    onClick={() => setDuration(d.minutes)}
                    className={clsx(
                      "flex-1 rounded-sm border px-3 py-2 text-xs font-medium transition-colors",
                      duration === d.minutes
                        ? "border-gold-600 bg-gold-600 text-charcoal-950"
                        : "border-charcoal-600 text-warmwhite-dim hover:border-gold-700"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide text-warmwhite-dim">
                  Игроков
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={players}
                  onChange={(e) => setPlayers(Number(e.target.value))}
                  className="w-full rounded-sm border border-charcoal-600 bg-charcoal-950 px-3 py-2 text-sm text-warmwhite focus-visible:border-gold-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide text-warmwhite-dim">
                  Стоимость
                </label>
                <p className="rounded-sm border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-sm text-gold-500">
                  {formatMoney(price, table.currency)}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-warmwhite-dim">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-sm border border-charcoal-600 bg-charcoal-950 px-3 py-2 text-sm text-warmwhite focus-visible:border-gold-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-warmwhite-dim">
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 700 000 00 00"
                className="w-full rounded-sm border border-charcoal-600 bg-charcoal-950 px-3 py-2 text-sm text-warmwhite focus-visible:border-gold-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-warmwhite-dim">
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="w-full rounded-sm border border-charcoal-600 bg-charcoal-950 px-3 py-2 text-sm text-warmwhite focus-visible:border-gold-600"
              />
            </div>

            {error && <ErrorState title="Booking Failed" description={error} />}

            <Button size="lg" onClick={handleConfirm} disabled={!stillAvailable}>
              Confirm Booking
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

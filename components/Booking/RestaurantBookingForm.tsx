"use client";

import { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Button } from "@/components/ui/Button";
import { todayISO } from "@/lib/time";
import { CheckCircle2 } from "lucide-react";

/** Restaurant table reservation flow (PRD #17). Mock booking logic —
 * always succeeds client-side; a real backend should validate capacity. */
export function RestaurantBookingForm() {
  const { createRestaurantBooking } = useAppState();
  const [guestCount, setGuestCount] = useState(2);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("19:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-status-available/40 bg-status-available/10 px-6 py-12 text-center">
        <CheckCircle2 className="h-8 w-8 text-status-available" aria-hidden />
        <p className="font-serif text-xl text-warmwhite">
          Your reservation has been confirmed.
        </p>
        <p className="text-sm text-warmwhite-dim">
          {guestCount} гостя(-ей) · {date} · {time}
        </p>
        <Button variant="secondary" size="sm" onClick={() => setConfirmed(false)}>
          Новое бронирование
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) return;
        createRestaurantBooking({ guestCount, date, time, name, phone, comment });
        setConfirmed(true);
      }}
      className="grid gap-4 rounded-md border border-charcoal-700 bg-charcoal-900 p-6 sm:grid-cols-2"
    >
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wide text-warmwhite-dim">
          Количество гостей
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className="w-full rounded-sm border border-charcoal-600 bg-charcoal-950 px-3 py-2 text-sm text-warmwhite focus-visible:border-gold-600"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wide text-warmwhite-dim">
          Дата
        </label>
        <input
          type="date"
          value={date}
          min={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-sm border border-charcoal-600 bg-charcoal-950 px-3 py-2 text-sm text-warmwhite focus-visible:border-gold-600"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wide text-warmwhite-dim">
          Время
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-sm border border-charcoal-600 bg-charcoal-950 px-3 py-2 text-sm text-warmwhite focus-visible:border-gold-600"
          required
        />
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
          required
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
          required
        />
      </div>

      <div className="sm:col-span-2">
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

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Book Restaurant Table
        </Button>
      </div>
    </form>
  );
}

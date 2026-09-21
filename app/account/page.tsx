"use client";

import { useMemo, useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { useAppState } from "@/context/AppStateContext";
import { MyBookingCard } from "@/components/Booking/MyBookingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { formatDateChip } from "@/lib/time";
import { clsx } from "@/lib/clsx";
import Link from "next/link";

type TabKey = "active" | "upcoming" | "completed" | "cancelled";

const TABS: { key: TabKey; label: string }[] = [
  { key: "active", label: "Активные" },
  { key: "upcoming", label: "Предстоящие" },
  { key: "completed", label: "Завершённые" },
  { key: "cancelled", label: "Отменённые" },
];

export default function AccountPage() {
  const { myBookings } = useBooking();
  const { restaurantBookings } = useAppState();
  const [tab, setTab] = useState<TabKey>("active");

  const filtered = useMemo(
    () => myBookings.filter((b) => b.liveStatus === tab),
    [myBookings, tab]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="My Booking" title="Мои бронирования" className="mb-8" />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              "rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
              tab === t.key
                ? "border-gold-600 bg-gold-600 text-charcoal-950"
                : "border-charcoal-600 text-warmwhite-dim hover:border-gold-700 hover:text-gold-400"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Bookings"
          description="You don't have any bookings yet."
          action={
            <Link href="/billiard">
              <Button size="sm">Choose another time</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((b) => (
            <MyBookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}

      {restaurantBookings.length > 0 && (
        <div className="mt-14">
          <SectionHeading title="Бронирования столика" className="mb-6" />
          <div className="flex flex-col gap-3">
            {restaurantBookings.map((rb) => (
              <div
                key={rb.id}
                className="flex items-center justify-between rounded-md border border-charcoal-700 bg-charcoal-900 px-5 py-4"
              >
                <div>
                  <p className="text-sm text-warmwhite">
                    {rb.guestCount} гостя(-ей) · {formatDateChip(rb.date)} · {rb.time}
                  </p>
                  <p className="text-xs text-warmwhite-dim">
                    {rb.name} · {rb.phone}
                  </p>
                </div>
                <span className="rounded-full border border-status-available/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-status-available">
                  {rb.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Video } from "lucide-react";
import type { LiveBooking } from "@/hooks/useBooking";
import { useBooking } from "@/hooks/useBooking";
import { Countdown } from "@/components/Countdown/Countdown";
import { Button } from "@/components/ui/Button";
import { ExtendBookingModal } from "@/components/Booking/ExtendBookingModal";
import { TABLE_TYPE_LABEL } from "@/lib/constants";
import { formatDateChip, formatTimeRange } from "@/lib/time";
import { clsx } from "@/lib/clsx";

const STATUS_LABEL: Record<LiveBooking["liveStatus"], string> = {
  upcoming: "UPCOMING",
  active: "ACTIVE",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

const STATUS_CLASS: Record<LiveBooking["liveStatus"], string> = {
  upcoming: "text-status-reserved border-status-reserved/40",
  active: "text-status-available border-status-available/40",
  completed: "text-warmwhite-dim border-charcoal-600",
  cancelled: "text-status-occupied border-status-occupied/40",
};

export function MyBookingCard({ booking }: { booking: LiveBooking }) {
  const { getTable, cancelBilliardBooking } = useBooking();
  const [showExtend, setShowExtend] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const table = getTable(booking.tableId);
  if (!table) return null;

  return (
    <div className="rounded-md border border-charcoal-700 bg-charcoal-900 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600">
            {TABLE_TYPE_LABEL[table.type]}
          </p>
          <p className="mt-1 font-serif text-2xl text-warmwhite">{table.name}</p>
          <p className="mt-1 text-sm text-warmwhite-dim">
            {formatDateChip(booking.date)} · {formatTimeRange(booking.startTime, booking.endTime)}
          </p>
        </div>
        <span
          className={clsx(
            "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
            STATUS_CLASS[booking.liveStatus]
          )}
        >
          {STATUS_LABEL[booking.liveStatus]}
        </span>
      </div>

      {booking.liveStatus === "active" && (
        <div className="mt-5 border-t border-charcoal-700 pt-5">
          <Countdown booking={booking} />
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-charcoal-700 pt-4">
        {booking.liveStatus === "active" && (
          <Link href={`/billiard/${table.id}`}>
            <Button size="sm" variant="secondary">
              <Video className="h-3.5 w-3.5" /> Watch Live Camera
            </Button>
          </Link>
        )}
        {(booking.liveStatus === "active" || booking.liveStatus === "upcoming") && (
          <Button size="sm" variant="secondary" onClick={() => setShowExtend(true)}>
            Extend Booking
          </Button>
        )}
        {(booking.liveStatus === "active" || booking.liveStatus === "upcoming") &&
          (confirmingCancel ? (
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                cancelBilliardBooking(booking.id);
                setConfirmingCancel(false);
              }}
            >
              Точно отменить?
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setConfirmingCancel(true)}>
              Cancel Booking
            </Button>
          ))}
      </div>

      {showExtend && <ExtendBookingModal booking={booking} onClose={() => setShowExtend(false)} />}
    </div>
  );
}

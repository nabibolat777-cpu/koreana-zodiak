"use client";

/**
 * Admin dashboard stub (PRD #44-#48). Full CRUD management is Post-MVP
 * (PRD #77); this read-only view demonstrates that the data layer
 * already supports it — every list below reads from the same
 * tables/bookings/cameras used by the customer-facing pages.
 */
import { useBooking } from "@/hooks/useBooking";
import { useAppState } from "@/context/AppStateContext";
import { CAMERAS } from "@/data/cameras";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDateChip, formatTimeRange, todayISO } from "@/lib/time";
import { clsx } from "@/lib/clsx";

export default function AdminPage() {
  const { liveTables } = useBooking();
  const { bookings } = useAppState();

  const today = todayISO();
  const todaysBookings = bookings
    .filter((b) => b.date === today && b.status !== "cancelled")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Admin (prototype)"
        title="Active Tables"
        subtitle="Read-only preview — full table/menu/booking/camera management is a Post-MVP milestone (see PRD §77)."
        className="mb-10"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {liveTables.map((t) => (
          <div key={t.id} className="rounded-md border border-charcoal-700 bg-charcoal-900 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-warmwhite">{t.name}</p>
              <StatusBadge status={t.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <SectionHeading title="Cameras" className="mb-6" />
        <div className="overflow-x-auto rounded-md border border-charcoal-700">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-charcoal-900 text-xs uppercase tracking-wide text-warmwhite-dim">
              <tr>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Camera</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {CAMERAS.map((c) => (
                <tr key={c.id} className="border-t border-charcoal-800">
                  <td className="px-4 py-3 text-warmwhite">{c.tableId}</td>
                  <td className="px-4 py-3 text-warmwhite-dim">{c.name}</td>
                  <td
                    className={clsx(
                      "px-4 py-3 font-medium capitalize",
                      c.status === "online" && "text-status-available",
                      c.status === "connecting" && "text-status-reserved",
                      c.status === "offline" && "text-status-occupied"
                    )}
                  >
                    {c.status === "online" ? "🟢" : c.status === "connecting" ? "🟡" : "🔴"} {c.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-14">
        <SectionHeading title="Today's Bookings" className="mb-6" />
        {todaysBookings.length === 0 ? (
          <p className="text-sm text-warmwhite-dim">Бронирований на сегодня нет.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-charcoal-700">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-charcoal-900 text-xs uppercase tracking-wide text-warmwhite-dim">
                <tr>
                  <th className="px-4 py-3">Table</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Players</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {todaysBookings.map((b) => (
                  <tr key={b.id} className="border-t border-charcoal-800">
                    <td className="px-4 py-3 text-warmwhite">{b.tableId}</td>
                    <td className="px-4 py-3 text-warmwhite-dim">
                      {formatDateChip(b.date)} · {formatTimeRange(b.startTime, b.endTime)}
                    </td>
                    <td className="px-4 py-3 text-warmwhite-dim">{b.name}</td>
                    <td className="px-4 py-3 text-warmwhite-dim">{b.numberOfPlayers}</td>
                    <td className="px-4 py-3 text-warmwhite-dim capitalize">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

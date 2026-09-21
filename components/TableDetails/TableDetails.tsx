"use client";

import { useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Availability } from "@/components/Availability/Availability";
import { CameraView } from "@/components/Camera/CameraView";
import { BilliardBookingModal } from "@/components/BookingModal/BilliardBookingModal";
import { CrossSell } from "@/components/CrossSell/CrossSell";
import { getZone } from "@/data/zones";
import { TABLE_TYPE_LABEL } from "@/lib/constants";
import { formatMoney } from "@/lib/time";
import { clsx } from "@/lib/clsx";

type Tab = "overview" | "availability" | "camera";

export function TableDetails({ tableId }: { tableId: string }) {
  const { getTable } = useBooking();
  const [tab, setTab] = useState<Tab>("overview");
  const [pendingSlot, setPendingSlot] = useState<{ date: string; time: string } | null>(null);

  const table = getTable(tableId);
  if (!table) {
    return <p className="text-warmwhite-dim">Стол не найден.</p>;
  }
  const zone = getZone(table.zone);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-charcoal-700 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-600">
            {TABLE_TYPE_LABEL[table.type]} · {zone.label} · {zone.floor}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-warmwhite">{table.name}</h1>
          <div className="mt-3">
            <StatusBadge status={table.status} />
          </div>
        </div>
        <p className="font-serif text-2xl text-gold-500">
          {formatMoney(table.pricePerHour, table.currency)}
          <span className="text-sm text-warmwhite-dim"> / hour</span>
        </p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-charcoal-700">
        {(["overview", "availability", "camera"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "border-b-2 px-4 py-2.5 text-sm font-medium uppercase tracking-wide transition-colors",
              tab === t
                ? "border-gold-600 text-gold-400"
                : "border-transparent text-warmwhite-dim hover:text-warmwhite"
            )}
          >
            {t === "overview" ? "Overview" : t === "availability" ? "Availability" : "Camera"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="flex flex-col gap-5">
          <p className="max-w-xl text-warmwhite-dim">
            {TABLE_TYPE_LABEL[table.type]} стол премиум-класса. Идеально подходит для игры
            компанией из 2-6 человек. Забронируйте время в разделе «Availability» или начните
            прямо сейчас.
          </p>
          <CrossSell
            eyebrow="Hungry during your game?"
            title="Order from Koreana BBQ"
            ctaLabel="Menu"
            href="/menu"
          />
        </div>
      )}

      {tab === "availability" && (
        <Availability tableId={table.id} onSelectSlot={(date, time) => setPendingSlot({ date, time })} />
      )}

      {tab === "camera" && <CameraView tableId={table.id} />}

      {pendingSlot && (
        <BilliardBookingModal
          table={table}
          date={pendingSlot.date}
          time={pendingSlot.time}
          onClose={() => setPendingSlot(null)}
        />
      )}
    </div>
  );
}

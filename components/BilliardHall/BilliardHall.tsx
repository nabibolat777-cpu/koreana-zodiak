"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { BilliardTableRow } from "@/components/BilliardTable/BilliardTable";
import { ZoneFloorPlan } from "@/components/BilliardHall/ZoneFloorPlan";
import { EmptyState } from "@/components/ui/EmptyState";
import { ZONES, getZone } from "@/data/zones";
import { clsx } from "@/lib/clsx";
import type { TableStatus, TableZoneKey } from "@/types";

type StatusFilter = TableStatus | "all";

/**
 * Real floor-plan hall map (PRD #21) — a zone picker (the venue's five
 * rooms) plus that room's actual layout, with a mandatory list-view
 * fallback for mobile (PRD #57) so no one has to pinch-zoom into a floor
 * plan on a phone.
 */
export function BilliardHall() {
  const { liveTables } = useBooking();
  const [zoneKey, setZoneKey] = useState<TableZoneKey>(ZONES[0].key);
  const [view, setView] = useState<"map" | "list">("map");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const zone = getZone(zoneKey);

  const zoneTables = useMemo(
    () => liveTables.filter((t) => t.zone === zoneKey),
    [liveTables, zoneKey]
  );

  const filtered = useMemo(
    () => zoneTables.filter((t) => statusFilter === "all" || t.status === statusFilter),
    [zoneTables, statusFilter]
  );

  const availableCount = useMemo(
    () => zoneTables.filter((t) => t.status === "available").length,
    [zoneTables]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Выбор зала">
        {ZONES.map((z) => (
          <FilterChip
            key={z.key}
            label={z.label}
            active={zoneKey === z.key}
            onClick={() => setZoneKey(z.key)}
            role="tab"
          />
        ))}
      </div>

      <p className="mb-6 flex flex-wrap gap-x-5 gap-y-1 text-xs text-warmwhite-dim">
        <span>{zone.floor}</span>
        <span>{zone.note}</span>
        <span>
          <b className="font-semibold text-warmwhite">{zoneTables.length}</b> бильярдных столов
        </span>
        <span>
          <b className="font-semibold text-warmwhite">{availableCount}</b> свободно сейчас
        </span>
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="🟢 Свободен"
            active={statusFilter === "available"}
            onClick={() => setStatusFilter(statusFilter === "available" ? "all" : "available")}
          />
          <FilterChip
            label="🟡 Забронирован"
            active={statusFilter === "reserved"}
            onClick={() => setStatusFilter(statusFilter === "reserved" ? "all" : "reserved")}
          />
        </div>

        <div className="flex gap-1 rounded-sm border border-charcoal-600 p-1">
          <button
            onClick={() => setView("map")}
            aria-pressed={view === "map"}
            aria-label="Показать карту зала"
            className={clsx(
              "rounded-sm p-1.5",
              view === "map" ? "bg-gold-600 text-charcoal-950" : "text-warmwhite-dim hover:text-gold-400"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            aria-label="Показать список столов"
            className={clsx(
              "rounded-sm p-1.5",
              view === "list" ? "bg-gold-600 text-charcoal-950" : "text-warmwhite-dim hover:text-gold-400"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No Available Tables" description="No tables are available for this time." />
      ) : view === "map" ? (
        <ZoneFloorPlan zone={zone} tables={filtered} />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map((table) => (
            <BilliardTableRow key={table.id} table={table} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  role,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  role?: "tab";
}) {
  return (
    <button
      onClick={onClick}
      role={role}
      aria-selected={role === "tab" ? active : undefined}
      aria-pressed={role ? undefined : active}
      className={clsx(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-gold-600 bg-gold-600 text-charcoal-950"
          : "border-charcoal-600 text-warmwhite-dim hover:border-gold-700 hover:text-gold-400"
      )}
    >
      {label}
    </button>
  );
}

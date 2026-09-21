import Link from "next/link";
import type { BilliardTable as BilliardTableType } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TABLE_TYPE_LABEL } from "@/lib/constants";
import { formatMoney } from "@/lib/time";
import { clsx } from "@/lib/clsx";

/**
 * Row layout used by the mobile list-view fallback (PRD #57) — the desktop
 * hall map is the real floor-plan SVG (components/BilliardHall/ZoneFloorPlan.tsx).
 */
export function BilliardTableRow({ table }: { table: BilliardTableType }) {
  const disabled = table.status === "closed";
  const rowClass = clsx(
    "flex items-center justify-between rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 transition-colors",
    disabled ? "opacity-50" : "hover:border-gold-700/60"
  );

  const inner = (
    <>
      <div>
        <p className="text-sm font-semibold text-warmwhite">{table.name}</p>
        <p className="text-xs text-warmwhite-dim">{TABLE_TYPE_LABEL[table.type]}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <StatusBadge status={table.status} />
        <span className="text-xs text-warmwhite-dim">
          {formatMoney(table.pricePerHour, table.currency)}/ч
        </span>
      </div>
    </>
  );

  if (disabled) {
    return (
      <div className={rowClass} aria-disabled>
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/billiard/${table.id}`} className={rowClass}>
      {inner}
    </Link>
  );
}

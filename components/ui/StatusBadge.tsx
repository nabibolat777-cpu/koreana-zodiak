import type { TableStatus } from "@/types";
import { TABLE_STATUS_EMOJI, TABLE_STATUS_LABEL } from "@/lib/constants";
import { clsx } from "@/lib/clsx";

const DOT_CLASSES: Record<TableStatus, string> = {
  available: "bg-status-available",
  occupied: "bg-status-occupied",
  reserved: "bg-status-reserved",
  closed: "bg-status-closed",
};

const TEXT_CLASSES: Record<TableStatus, string> = {
  available: "text-status-available",
  occupied: "text-status-occupied",
  reserved: "text-status-reserved",
  closed: "text-status-closed",
};

/**
 * Status is always communicated with both color AND text/emoji so the UI
 * never relies on color alone (PRD #58, accessibility).
 */
export function StatusBadge({
  status,
  className,
}: {
  status: TableStatus;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide",
        TEXT_CLASSES[status],
        className
      )}
      role="status"
    >
      <span className={clsx("h-2 w-2 rounded-full", DOT_CLASSES[status])} aria-hidden />
      {TABLE_STATUS_EMOJI[status]} {TABLE_STATUS_LABEL[status]}
    </span>
  );
}

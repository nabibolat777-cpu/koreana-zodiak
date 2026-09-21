import Link from "next/link";
import type { BilliardTable } from "@/types";
import type { ZoneDefinition, ZoneFeature } from "@/data/zones";
import { TABLE_STATUS_LABEL } from "@/lib/constants";
import { formatMoney } from "@/lib/time";
import { clsx } from "@/lib/clsx";

const STATUS_DOT_FILL: Record<BilliardTable["status"], string> = {
  available: "fill-status-available",
  occupied: "fill-status-occupied",
  reserved: "fill-status-reserved",
  closed: "fill-status-closed",
};

/**
 * Real floor-plan hall map (replaces the earlier abstract grid — see
 * README "Hall map ... floor-plan coordinates"). Wall outlines and fixed
 * furniture come from data/zones.ts; per-table position comes from each
 * table's own `position` (data/tables.ts), both traced from the
 * designer's PDF plans.
 */
export function ZoneFloorPlan({
  zone,
  tables,
}: {
  zone: ZoneDefinition;
  tables: BilliardTable[];
}) {
  return (
    <div className="rounded-md border border-charcoal-700 bg-charcoal-900 p-3">
      <svg
        viewBox={zone.viewBox}
        className="block h-auto w-full rounded-sm bg-charcoal-950"
        role="img"
        aria-label={`Карта зала ${zone.label}`}
      >
        <defs>
          <linearGradient id="zoneFelt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b2e22" />
            <stop offset="100%" stopColor="#062018" />
          </linearGradient>
        </defs>

        <path d={zone.wallPath} className="fill-charcoal-900" />
        <path
          d={zone.wallPath}
          fill="none"
          className="stroke-charcoal-600"
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path
          d={zone.wallPath}
          fill="none"
          className="stroke-charcoal-950"
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {zone.columns?.map((c, i) => (
          <rect
            key={i}
            x={c.x - 4}
            y={c.y - 4}
            width={8}
            height={8}
            className="fill-charcoal-600"
          />
        ))}

        {zone.doors?.map((d, i) => (
          <DoorArc key={i} {...d} />
        ))}

        {zone.features?.map((f, i) => (
          <Feature key={i} feature={f} />
        ))}

        {zone.smallTables?.map((t, i) => {
          const scx = t.x + t.w / 2;
          const scy = t.y + t.h / 2;
          return (
            <rect
              key={i}
              x={t.x}
              y={t.y}
              width={t.w}
              height={t.h}
              rx={2}
              transform={t.rot ? `rotate(${t.rot} ${scx} ${scy})` : undefined}
              className="fill-charcoal-800/60 stroke-charcoal-600/70"
              strokeWidth={1}
            />
          );
        })}

        {tables.map((table) => (
          <BilliardTableIcon key={table.id} table={table} />
        ))}
      </svg>
    </div>
  );
}

function BilliardTableIcon({ table }: { table: BilliardTable }) {
  const { x, y, w, h, rot } = table.position;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const number = table.id.split("-")[1]?.replace(/^0+(?=\d)/, "") ?? table.name;
  const disabled = table.status === "closed";
  const label = `${table.name}, ${TABLE_STATUS_LABEL[table.status]}, ${formatMoney(table.pricePerHour, table.currency)} в час`;

  const icon = (
    <g transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2.5}
        fill="url(#zoneFelt)"
        className={clsx(
          "stroke-gold-700 transition-colors",
          !disabled && "group-hover:stroke-gold-400"
        )}
        strokeWidth={1.5}
      />
      {[
        [x + 3.5, y + 3.5],
        [x + w - 3.5, y + 3.5],
        [x + 3.5, y + h - 3.5],
        [x + w - 3.5, y + h - 3.5],
      ].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={3} className="fill-charcoal-900 stroke-gold-900" strokeWidth={0.7} />
      ))}
      <text
        x={cx}
        y={cy + 3}
        textAnchor="middle"
        className="fill-warmwhite text-[8.5px] font-bold"
        style={{ pointerEvents: "none" }}
      >
        {number}
      </text>
      <circle
        cx={x + w - 2}
        cy={y}
        r={3.8}
        className={clsx(STATUS_DOT_FILL[table.status], "stroke-charcoal-900")}
        strokeWidth={1.1}
      />
    </g>
  );

  if (disabled) {
    return (
      <g aria-disabled className="cursor-not-allowed opacity-50">
        {icon}
      </g>
    );
  }

  return (
    <Link
      href={`/billiard/${table.id}`}
      aria-label={label}
      className="group cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 focus-visible:outline-offset-2"
    >
      {icon}
    </Link>
  );
}

function DoorArc({ x, y, r, a1, a2 }: { x: number; y: number; r: number; a1: number; a2: number }) {
  const rad1 = (a1 * Math.PI) / 180;
  const rad2 = (a2 * Math.PI) / 180;
  const x1 = x + r * Math.cos(rad1);
  const y1 = y + r * Math.sin(rad1);
  const x2 = x + r * Math.cos(rad2);
  const y2 = y + r * Math.sin(rad2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return (
    <g className="stroke-status-available/50" aria-hidden>
      <line x1={x} y1={y} x2={x1} y2={y1} strokeWidth={1.2} />
      <path d={`M ${x1},${y1} A ${r},${r} 0 ${large} 1 ${x2},${y2}`} fill="none" strokeWidth={1} />
      <line x1={x} y1={y} x2={x2} y2={y2} strokeWidth={1.2} />
    </g>
  );
}

// Splits a room/feature label into 1-2 lines that fit inside its shape's
// width, so names render INSIDE the shape instead of floating beside it.
const LABEL_CHAR_WIDTH = 5.4;

function wrapLabel(label: string, maxWidth: number): string[] {
  const maxChars = Math.max(3, Math.floor((maxWidth - 10) / LABEL_CHAR_WIDTH));
  if (label.length <= maxChars) return [label];

  const words: string[] = [];
  label.split(/\s+/).forEach((word) => {
    const idx = word.indexOf("-");
    if (idx > -1 && idx < word.length - 1) {
      words.push(word.slice(0, idx + 1), word.slice(idx + 1));
    } else {
      words.push(word);
    }
  });

  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (test.replace(/-\s/, "-").length <= maxChars || !current) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 2).map((line) => line.replace(/-\s/, "-"));
}

function CenteredLabel({ cx, cy, label, width }: { cx: number; cy: number; label?: string; width: number }) {
  if (!label) return null;
  const lines = wrapLabel(label, width);
  const lineHeight = 11;
  const startY = cy - ((lines.length - 1) * lineHeight) / 2 + 3.2;
  return (
    <>
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={startY + i * lineHeight}
          textAnchor="middle"
          className="fill-warmwhite-dim/70 text-[9.5px]"
        >
          {line}
        </text>
      ))}
    </>
  );
}

function Feature({ feature: f }: { feature: ZoneFeature }) {
  if (f.type === "circle" && f.cx != null && f.cy != null && f.r != null) {
    return (
      <g>
        <circle cx={f.cx} cy={f.cy} r={f.r} className="fill-charcoal-800 stroke-charcoal-600" strokeWidth={1.3} />
        <CenteredLabel cx={f.cx} cy={f.cy} label={f.label} width={f.r * 1.7} />
      </g>
    );
  }

  if (f.type === "stairs" && f.x != null && f.y != null && f.w != null && f.h != null) {
    const rows = 6;
    const lines = Array.from({ length: rows + 1 }, (_, i) => f.y! + (i * f.h!) / rows);
    return (
      <g aria-hidden>
        {lines.map((yy, i) => (
          <line key={i} x1={f.x} y1={yy} x2={f.x! + f.w!} y2={yy} className="stroke-charcoal-600/60" strokeWidth={1} />
        ))}
        <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="none" className="stroke-charcoal-600/50" strokeWidth={1} />
      </g>
    );
  }

  if (f.type === "bar" && f.x != null && f.y != null && f.w != null && f.h != null) {
    return (
      <g>
        <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={3} className="fill-charcoal-800 stroke-gold-900" strokeWidth={1.2} />
        <CenteredLabel cx={f.x + f.w / 2} cy={f.y + f.h / 2} label={f.label} width={f.w} />
      </g>
    );
  }

  if (f.type === "bar-curve") {
    return (
      <g>
        <path
          d="M 330,230 C 300,260 300,340 330,375 L 355,375 C 330,345 330,265 355,235 Z"
          className="fill-charcoal-800 stroke-gold-900"
          strokeWidth={1.2}
        />
        <circle cx={345} cy={215} r={12} className="fill-charcoal-800/80 stroke-charcoal-600" strokeWidth={1} />
        <circle cx={345} cy={395} r={12} className="fill-charcoal-800/80 stroke-charcoal-600" strokeWidth={1} />
        <text x={345} y={309} textAnchor="middle" className="fill-warmwhite-dim/70 text-[9.5px]">
          бар
        </text>
      </g>
    );
  }

  if (f.type === "lounge" && f.x != null && f.y != null && f.w != null && f.h != null) {
    return (
      <g>
        <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={10} className="fill-charcoal-800/70 stroke-charcoal-700" strokeWidth={1} />
        <CenteredLabel cx={f.x + f.w / 2} cy={f.y + f.h / 2} label={f.label} width={f.w} />
      </g>
    );
  }

  if (f.x != null && f.y != null && f.w != null && f.h != null) {
    return (
      <g>
        <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={2} className="fill-charcoal-800 stroke-charcoal-600" strokeWidth={1.3} />
        <CenteredLabel cx={f.x + f.w / 2} cy={f.y + f.h / 2} label={f.label} width={f.w} />
      </g>
    );
  }

  return null;
}

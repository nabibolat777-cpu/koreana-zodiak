/**
 * DEMO DATA
 * ---------
 * Table count, numbering and on-floor-plan position come from the
 * designer's PDF furniture layouts (see data/zones.ts for the room
 * outlines those positions live inside) — real for the room shapes and
 * table count per room, but hand-traced rather than surveyed, and pricing
 * is still a placeholder (see PRD #19, #78). Swap the numbers below once
 * the venue confirms them.
 */
import type { BilliardTable, TableZoneKey } from "@/types";

// Base statuses are seeded in a repeating pattern so the hall map shows a
// realistic mix on first load. Real status should come from the booking
// engine at runtime (see services/bookingService.ts -> deriveTableStatus).
const STATUS_CYCLE: BilliardTable["status"][] = [
  "available",
  "available",
  "available",
  "occupied",
  "available",
  "reserved",
  "available",
  "closed",
];

interface TableSpot {
  n: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
}

// Per-zone table geometry, traced 1:1 from the confirmed floor-plan
// mockup (SVG coordinates in the owning zone's viewBox — see data/zones.ts).
const ZONE_TABLES: Record<TableZoneKey, TableSpot[]> = {
  sky: [
    { n: 1, x: 112, y: 238, w: 78, h: 36 },
    { n: 2, x: 245, y: 238, w: 78, h: 36 },
    { n: 3, x: 112, y: 308, w: 78, h: 36 },
    { n: 4, x: 245, y: 308, w: 78, h: 36 },
    { n: 5, x: 340, y: 300, w: 60, h: 32 },
    { n: 6, x: 112, y: 382, w: 78, h: 36 },
    { n: 7, x: 245, y: 382, w: 78, h: 36 },
    { n: 8, x: 155, y: 480, w: 78, h: 36, rot: -8 },
  ],
  red: [
    { n: 1, x: 130, y: 170, w: 78, h: 36 },
    { n: 2, x: 130, y: 270, w: 78, h: 36 },
    { n: 3, x: 270, y: 270, w: 64, h: 34 },
    { n: 4, x: 130, y: 370, w: 78, h: 36 },
    { n: 5, x: 270, y: 370, w: 64, h: 34 },
    { n: 6, x: 130, y: 470, w: 78, h: 36 },
    { n: 7, x: 270, y: 605, w: 64, h: 34 },
  ],
  heaven: [
    { n: 1, x: 150, y: 280, w: 70, h: 34 },
    { n: 2, x: 150, y: 360, w: 70, h: 34 },
    { n: 3, x: 150, y: 440, w: 70, h: 34 },
    { n: 4, x: 380, y: 275, w: 64, h: 64 },
    { n: 5, x: 440, y: 392, w: 88, h: 34 },
    { n: 6, x: 440, y: 438, w: 88, h: 34 },
    { n: 7, x: 355, y: 400, w: 64, h: 64 },
    { n: 8, x: 300, y: 498, w: 82, h: 38, rot: -10 },
  ],
  sport: [
    { n: 1, x: 130, y: 190, w: 78, h: 36 },
    { n: 2, x: 130, y: 390, w: 78, h: 36 },
    { n: 3, x: 130, y: 600, w: 78, h: 36 },
    { n: 4, x: 245, y: 330, w: 80, h: 36 },
    { n: 5, x: 280, y: 445, w: 64, h: 78 },
    { n: 6, x: 280, y: 545, w: 64, h: 78 },
  ],
  pool: [
    { n: 1, x: 180, y: 215, w: 75, h: 36 },
    { n: 2, x: 270, y: 215, w: 75, h: 36 },
    { n: 3, x: 360, y: 215, w: 75, h: 36 },
    { n: 4, x: 190, y: 320, w: 75, h: 36, rot: 8 },
    { n: 5, x: 280, y: 335, w: 75, h: 36, rot: 4 },
    { n: 6, x: 370, y: 325, w: 75, h: 36 },
  ],
};

const ZONE_PRICE: Record<TableZoneKey, number> = {
  sky: 4000,
  red: 4000,
  heaven: 4000,
  sport: 4000,
  pool: 3500,
};

function buildZoneTables(zone: TableZoneKey): BilliardTable[] {
  return ZONE_TABLES[zone].map((spot, index) => {
    const id = `${zone}-${String(spot.n).padStart(2, "0")}`;
    return {
      id,
      name: `Стол ${String(spot.n).padStart(2, "0")}`,
      type: zone === "pool" ? "pool" : "russian",
      zone,
      status: spot.n === 1 ? "available" : STATUS_CYCLE[index % STATUS_CYCLE.length],
      pricePerHour: ZONE_PRICE[zone],
      currency: "₸",
      cameraId: `cam-${id}`,
      position: { x: spot.x, y: spot.y, w: spot.w, h: spot.h, rot: spot.rot },
    };
  });
}

export const BILLIARD_TABLES: BilliardTable[] = (
  Object.keys(ZONE_TABLES) as TableZoneKey[]
).flatMap(buildZoneTables);

export function getTableById(id: string): BilliardTable | undefined {
  return BILLIARD_TABLES.find((t) => t.id === id);
}

export function getTablesByZone(zone: TableZoneKey): BilliardTable[] {
  return BILLIARD_TABLES.filter((t) => t.zone === zone);
}

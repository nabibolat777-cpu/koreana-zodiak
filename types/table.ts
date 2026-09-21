/**
 * Billiard table domain types.
 *
 * `status` here is the *base* status coming from the data layer / future
 * backend. The UI derives an *effective* status by combining this base
 * status with live bookings (see services/bookingService.ts -> deriveTableStatus)
 * so a table can turn "reserved"/"occupied" automatically as bookings
 * start and end, without the underlying mock record changing.
 */

export type TableType = "russian" | "pool";

export type TableStatus = "available" | "occupied" | "reserved" | "closed";

/** The five physical rooms at Zodiak — see data/zones.ts for their floor-plan geometry. */
export type TableZoneKey = "sky" | "red" | "heaven" | "sport" | "pool";

export interface TablePosition {
  /** Table rail, in the owning zone's SVG viewBox coordinate space (see data/zones.ts) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Rotation in degrees around the table's own center, for tables angled against a wall */
  rot?: number;
}

export interface BilliardTable {
  id: string;
  name: string;
  type: TableType;
  zone: TableZoneKey;
  status: TableStatus;
  pricePerHour: number;
  currency: string;
  cameraId?: string;
  position: TablePosition;
}

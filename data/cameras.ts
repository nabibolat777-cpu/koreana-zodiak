/**
 * DEMO DATA — mock camera fleet, one per table (PRD #35, #40, #41).
 * No real cameras are wired up. `streamUrl` points at a mock in-app
 * demo route so the frontend contract is ready for a real RTSP/HLS/
 * WebRTC provider later.
 */
import type { Camera } from "@/types";
import { BILLIARD_TABLES } from "./tables";

const OFFLINE_TABLE_IDS = new Set(
  BILLIARD_TABLES.filter((t) => t.status === "closed").map((t) => t.id)
);

export const CAMERAS: Camera[] = BILLIARD_TABLES.map((table, index) => {
  const status: Camera["status"] = OFFLINE_TABLE_IDS.has(table.id)
    ? "offline"
    : index % 11 === 0
      ? "connecting"
      : "online";

  return {
    id: table.cameraId ?? `cam-${table.id}`,
    tableId: table.id,
    name: `Камера — ${table.name}`,
    status,
    streamUrl: status === "offline" ? undefined : `/demo/${table.id}`,
    lastUpdated: new Date().toISOString(),
  };
});

export function getCameraForTable(tableId: string): Camera | undefined {
  return CAMERAS.find((c) => c.tableId === tableId);
}

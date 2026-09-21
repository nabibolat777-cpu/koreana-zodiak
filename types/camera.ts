/**
 * Camera domain types.
 *
 * Prototype uses mock stream URLs (e.g. "/demo/table-07"). The frontend
 * contract (Camera.streamUrl) is designed so a real RTSP/HLS/WebRTC
 * provider URL can be dropped in without changing any component code.
 */

export type CameraStatus = "online" | "connecting" | "offline";

export interface Camera {
  id: string;
  tableId: string;
  name: string;
  status: CameraStatus;
  streamUrl?: string;
  lastUpdated: string;
}

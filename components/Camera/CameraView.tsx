"use client";

import { useState } from "react";
import { Maximize2, Video, VideoOff, Wifi } from "lucide-react";
import { getCameraForTable } from "@/data/cameras";
import { useAppState } from "@/context/AppStateContext";
import { useBooking } from "@/hooks/useBooking";
import { useNow } from "@/hooks/useNow";
import { canAccessCamera } from "@/services/cameraService";
import { Button } from "@/components/ui/Button";
import { pad2 } from "@/lib/time";

/**
 * Live camera tab (PRD #36-#43). Access is re-derived from the current
 * user + active bookings on every render — this is a *client-side*
 * approximation for the prototype; a real deployment must issue a
 * short-lived, server-signed stream token per booking instead (PRD #39,
 * #69), so a user can never reach another customer's feed by editing the
 * URL.
 */
export function CameraView({ tableId }: { tableId: string }) {
  const { getTable } = useBooking();
  const now = useNow();
  const [requested, setRequested] = useState(false);

  const camera = getCameraForTable(tableId);
  const table = getTable(tableId);
  const bookingsAccess = useBookingAccess(tableId);

  if (!camera || !table) return null;

  if (camera.status === "offline") {
    return <CameraFrame label={table.name} state="offline" />;
  }

  if (!bookingsAccess.allowed) {
    return (
      <CameraFrame label={table.name} state="no-access">
        <p className="text-sm text-warmwhite-dim">
          {bookingsAccess.reason === "no-active-booking"
            ? "Camera available during your booking."
            : "Camera access ended"}
        </p>
      </CameraFrame>
    );
  }

  if (!requested) {
    return (
      <CameraFrame label={table.name} state="gate">
        <Button onClick={() => setRequested(true)} className="mt-2">
          <Video className="h-4 w-4" /> Watch Live Camera
        </Button>
      </CameraFrame>
    );
  }

  if (camera.status === "connecting") {
    return <CameraFrame label={table.name} state="connecting" />;
  }

  return <CameraFrame label={table.name} state="live" now={now} />;
}

function useBookingAccess(tableId: string) {
  const { user } = useAppState();
  const { myBookings } = useBooking();
  const now = useNow();
  const camera = getCameraForTable(tableId);
  if (!camera) return { allowed: false as const, reason: "no-active-booking" as const };
  return canAccessCamera(camera, user, myBookings, now);
}

function CameraFrame({
  label,
  state,
  now,
  children,
}: {
  label: string;
  state: "live" | "connecting" | "offline" | "no-access" | "gate";
  now?: Date;
  children?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-charcoal-700 bg-charcoal-950">
      <div className="flex items-center justify-between border-b border-charcoal-700 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {state === "live" ? (
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-status-occupied">
              <span className="h-2 w-2 animate-pulse rounded-full bg-status-occupied" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-warmwhite-dim">
              <Wifi className="h-3.5 w-3.5" /> {label}
            </span>
          )}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-warmwhite">{label}</p>
        {state === "live" && (
          <button
            aria-label="Fullscreen"
            className="text-warmwhite-dim hover:text-gold-400"
            onClick={(e) => {
              const el = (e.currentTarget.closest("[data-camera-frame]") as HTMLElement) ?? undefined;
              el?.requestFullscreen?.();
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        data-camera-frame
        className="relative flex aspect-video items-center justify-center bg-charcoal-900"
      >
        {state === "live" && (
          <>
            <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(224,189,111,0.15)_3px,rgba(224,189,111,0.15)_4px)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,138,107,0.15),transparent_65%)]" />
            <div className="relative flex h-16 w-32 items-center justify-center rounded-sm border-2 border-gold-700 bg-emerald-950">
              <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
            </div>
            {now && (
              <span className="absolute bottom-3 right-3 rounded-sm bg-charcoal-950/70 px-2 py-1 font-mono text-xs text-warmwhite">
                {pad2(now.getHours())}:{pad2(now.getMinutes())}:{pad2(now.getSeconds())}
              </span>
            )}
            <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-warmwhite-dim/60">
              Demo stream
            </span>
          </>
        )}

        {state === "connecting" && (
          <div className="flex flex-col items-center gap-2 text-warmwhite-dim">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold-600 border-t-transparent" />
            <p className="text-xs uppercase tracking-wide">Connecting…</p>
          </div>
        )}

        {state === "offline" && (
          <div className="flex flex-col items-center gap-2 text-warmwhite-dim">
            <VideoOff className="h-8 w-8" />
            <p className="text-sm">Camera is currently unavailable.</p>
          </div>
        )}

        {(state === "no-access" || state === "gate") && (
          <div className="flex flex-col items-center gap-2 px-6 text-center text-warmwhite-dim">
            <Video className="h-8 w-8" />
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

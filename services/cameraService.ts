/**
 * Camera access control (PRD #38-#43).
 *
 * IMPORTANT: this is a *client-side* approximation for the prototype only.
 * A real deployment MUST re-check camera authorization server-side (e.g.
 * a signed, short-lived stream token issued per booking) — never trust
 * the client to decide whether it may view a stream (PRD #39, #69).
 */
import type { AppUser, Booking, Camera } from "@/types";
import { combineDateTime } from "@/lib/time";
import { deriveBookingStatus } from "./bookingService";

export type CameraAccessResult =
  | { allowed: true; booking: Booking }
  | { allowed: false; reason: "no-active-booking" | "not-authenticated" };

export function getActiveBookingForTable(
  tableId: string,
  userId: string,
  bookings: Booking[],
  now: Date
): Booking | undefined {
  return bookings.find(
    (b) =>
      b.tableId === tableId &&
      b.userId === userId &&
      deriveBookingStatus(b, now) === "active"
  );
}

export function canAccessCamera(
  camera: Camera,
  user: AppUser | null,
  bookings: Booking[],
  now: Date = new Date()
): CameraAccessResult {
  if (!user) return { allowed: false, reason: "not-authenticated" };

  // Admins and staff can view any camera (PRD #38).
  if (user.role === "admin" || user.role === "staff") {
    const anyBooking = bookings.find((b) => b.tableId === camera.tableId);
    return anyBooking
      ? { allowed: true, booking: anyBooking }
      : { allowed: false, reason: "no-active-booking" };
  }

  const booking = getActiveBookingForTable(camera.tableId, user.id, bookings, now);
  if (!booking) return { allowed: false, reason: "no-active-booking" };
  return { allowed: true, booking };
}

/** True only for the exact minute range of the booking — used to show
 * "Camera access ended" immediately once a game finishes (PRD #43). */
export function isWithinBookingWindow(booking: Booking, now: Date): boolean {
  const start = combineDateTime(booking.date, booking.startTime);
  const end = combineDateTime(booking.date, booking.endTime);
  return now >= start && now < end;
}

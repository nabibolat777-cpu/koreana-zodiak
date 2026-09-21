/**
 * DEMO DATA — seed bookings.
 *
 * The current (mock) user starts with NO bookings of their own: they must
 * pick a table and a time slot through the normal booking flow, same as a
 * real customer would. The only seed entry is another customer's booking
 * on a different table, kept so the hall map/table detail pages have at
 * least one table that reads as occupied by someone else and so the
 * double-booking-protection / camera-access-denial paths (this user must
 * NOT see or access another customer's camera feed) can be exercised
 * without first creating a conflicting booking by hand.
 */
import type { Booking } from "@/types";
import { todayISO } from "@/lib/time";

/**
 * Exported as a function (not a pre-computed constant) because
 * `createdAt`/`date` derive from `new Date()`: evaluating it once at
 * module load would run once on the server during SSR and again in the
 * browser during hydration, at two different instants, producing
 * mismatched markup and a React hydration error. Callers must only invoke
 * this on the client (e.g. from a useEffect, after mount) — see
 * AppStateContext.tsx.
 */
export function buildSeedBookings(): Booking[] {
  const now = new Date();

  return [
    // Another customer's booking — used to demonstrate conflict
    // protection and camera-access denial (the signed-in mock user must
    // NOT see/access this one).
    {
      id: "b-other-1",
      userId: "u-other-1",
      tableId: "red-03",
      date: todayISO(),
      startTime: "19:00",
      endTime: "20:00",
      duration: 60,
      status: "active",
      numberOfPlayers: 2,
      name: "Другой клиент",
      phone: "+7 700 000 00 01",
      createdAt: new Date(now.getTime() - 30 * 60_000).toISOString(),
    },
  ];
}

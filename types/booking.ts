/**
 * Booking domain types.
 *
 * Dates/times are stored as plain strings (YYYY-MM-DD / HH:mm) so the
 * prototype can run entirely on the client without timezone-handling
 * libraries. A real backend should normalize these to UTC instants.
 */

export type BookingStatus = "upcoming" | "active" | "completed" | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  tableId: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm, 24h */
  startTime: string;
  /** HH:mm, 24h */
  endTime: string;
  /** minutes */
  duration: number;
  status: BookingStatus;
  numberOfPlayers: number;
  name: string;
  phone: string;
  comment?: string;
  createdAt: string;
  /** total extension minutes applied so far, for display/analytics */
  extendedMinutes?: number;
}

export interface RestaurantBooking {
  id: string;
  userId: string;
  guestCount: number;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  name: string;
  phone: string;
  comment?: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export interface AvailabilitySlot {
  /** HH:mm */
  time: string;
  available: boolean;
}

export interface BookingResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  /** suggested alternative slots when a conflict occurs */
  suggestions?: AvailabilitySlot[];
}

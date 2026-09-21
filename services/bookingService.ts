/**
 * Booking business logic — table availability, conflict protection,
 * extension rules, and derived (live) status. This is written so it can
 * run identically on the client (prototype) or be lifted into a real
 * backend/API route later (PRD #52, #62, #63, #69 — never trust
 * client-side booking data; a real deployment must re-validate all of
 * this server-side).
 */
import type {
  AvailabilitySlot,
  Booking,
  BookingResult,
  BilliardTable,
} from "@/types";
import {
  addMinutes,
  combineDateTime,
  timeToMinutes,
  todayISO,
} from "@/lib/time";

const HALL_OPEN_MINUTES = timeToMinutes("12:00");
const HALL_CLOSE_MINUTES = timeToMinutes("23:59") + 1; // ~24:00
const SLOT_STEP_MINUTES = 60;

/** Active/upcoming bookings block a slot; cancelled/completed do not. */
function isBlocking(status: Booking["status"]): boolean {
  return status === "upcoming" || status === "active";
}

function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function isTableAvailable(
  tableId: string,
  date: string,
  startTime: string,
  durationMinutes: number,
  bookings: Booking[],
  excludeBookingId?: string
): boolean {
  const start = timeToMinutes(startTime);
  const end = start + durationMinutes;

  return !bookings.some((b) => {
    if (b.id === excludeBookingId) return false;
    if (b.tableId !== tableId || b.date !== date) return false;
    if (!isBlocking(b.status)) return false;
    return overlaps(start, end, timeToMinutes(b.startTime), timeToMinutes(b.endTime));
  });
}

export function getAvailabilityTimeline(
  tableId: string,
  date: string,
  bookings: Booking[]
): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  for (
    let minutes = HALL_OPEN_MINUTES;
    minutes < HALL_CLOSE_MINUTES;
    minutes += SLOT_STEP_MINUTES
  ) {
    const time = addMinutes("00:00", minutes);
    slots.push({
      time,
      available: isTableAvailable(tableId, date, time, SLOT_STEP_MINUTES, bookings),
    });
  }
  return slots;
}

export interface CreateBookingInput {
  userId: string;
  tableId: string;
  date: string;
  startTime: string;
  duration: number;
  numberOfPlayers: number;
  name: string;
  phone: string;
  comment?: string;
}

export function createBooking(
  input: CreateBookingInput,
  bookings: Booking[]
): BookingResult<Booking> {
  // The booking model stores one `date` shared by startTime/endTime, so a
  // booking can never cross midnight onto the next calendar day. Ending
  // exactly at minute 1440 ("24:00") would also wrap to "00:00" *today*
  // via minutesToTime's modulo, putting endTime before startTime — so the
  // last valid end instant is 23:59 (minute 1439), not 1440.
  if (timeToMinutes(input.startTime) + input.duration >= 24 * 60) {
    return {
      ok: false,
      error: "Бронирование не может продолжаться после полуночи. Выберите более раннее время или меньшую продолжительность.",
    };
  }

  if (!isTableAvailable(input.tableId, input.date, input.startTime, input.duration, bookings)) {
    return {
      ok: false,
      error: "Этот стол только что забронировали. Пожалуйста, выберите другое время.",
    };
  }

  const booking: Booking = {
    id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId: input.userId,
    tableId: input.tableId,
    date: input.date,
    startTime: input.startTime,
    endTime: addMinutes(input.startTime, input.duration),
    duration: input.duration,
    status: "upcoming",
    numberOfPlayers: input.numberOfPlayers,
    name: input.name,
    phone: input.phone,
    comment: input.comment,
    createdAt: new Date().toISOString(),
  };

  return { ok: true, data: booking };
}

const EXTENSION_PRICE_PER_HOUR: Record<string, number> = {
  russian: 4000,
  pool: 3500,
};

export function getExtensionPrice(table: BilliardTable, extraMinutes: number): number {
  const perHour = EXTENSION_PRICE_PER_HOUR[table.type] ?? table.pricePerHour;
  return Math.round((perHour / 60) * extraMinutes);
}

export function extendBooking(
  booking: Booking,
  extraMinutes: number,
  bookings: Booking[]
): BookingResult<Booking> {
  if (timeToMinutes(booking.endTime) + extraMinutes >= 24 * 60) {
    return {
      ok: false,
      error: "Продление невозможно: бронирование не может продолжаться после полуночи.",
    };
  }

  const newEnd = addMinutes(booking.endTime, extraMinutes);
  const available = isTableAvailable(
    booking.tableId,
    booking.date,
    booking.endTime,
    extraMinutes,
    bookings,
    booking.id
  );

  if (!available) {
    // Find the next fully-free slot after the current end time as a suggestion.
    const suggestions = getAvailabilityTimeline(booking.tableId, booking.date, bookings).filter(
      (s) => timeToMinutes(s.time) >= timeToMinutes(booking.endTime) && s.available
    );
    return {
      ok: false,
      error: `Стол занят с ${booking.endTime}. Продление невозможно на это время.`,
      suggestions,
    };
  }

  return {
    ok: true,
    data: {
      ...booking,
      endTime: newEnd,
      duration: booking.duration + extraMinutes,
      extendedMinutes: (booking.extendedMinutes ?? 0) + extraMinutes,
    },
  };
}

export function cancelBooking(booking: Booking): Booking {
  return { ...booking, status: "cancelled" };
}

/**
 * Derives the *effective* status of a booking from the clock, so seed
 * data and freshly-created bookings both behave consistently without a
 * server pushing status changes.
 */
export function deriveBookingStatus(booking: Booking, now: Date): Booking["status"] {
  if (booking.status === "cancelled") return "cancelled";
  const start = combineDateTime(booking.date, booking.startTime);
  const end = combineDateTime(booking.date, booking.endTime);
  if (now < start) return "upcoming";
  if (now >= start && now < end) return "active";
  return "completed";
}

/**
 * Derives a table's live hall-map status for "right now" by combining its
 * base mock status with any booking that is active/about-to-start today.
 */
export function deriveTableStatus(
  table: BilliardTable,
  bookings: Booking[],
  now: Date
): BilliardTable["status"] {
  if (table.status === "closed") return "closed";

  const today = todayISO();
  const relevant = bookings.filter(
    (b) => b.tableId === table.id && b.date === today && isBlocking(b.status)
  );

  const isOccupied = relevant.some((b) => {
    const start = combineDateTime(b.date, b.startTime);
    const end = combineDateTime(b.date, b.endTime);
    return now >= start && now < end;
  });
  if (isOccupied) return "occupied";

  const isReservedSoon = relevant.some((b) => {
    const start = combineDateTime(b.date, b.startTime);
    const diffMin = (start.getTime() - now.getTime()) / 60_000;
    return diffMin > 0 && diffMin <= 60;
  });
  if (isReservedSoon) return "reserved";

  return table.status;
}

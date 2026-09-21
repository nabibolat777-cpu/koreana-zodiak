"use client";

import { useMemo } from "react";
import { useAppState } from "@/context/AppStateContext";
import { useNow } from "./useNow";
import {
  deriveBookingStatus,
  deriveTableStatus,
  getAvailabilityTimeline,
  getExtensionPrice,
  isTableAvailable,
} from "@/services/bookingService";
import type { Booking, BilliardTable } from "@/types";

export interface LiveBooking extends Booking {
  liveStatus: Booking["status"];
}

/**
 * Convenience hook for anything billiard-booking related: current user's
 * bookings with live-derived status, live table statuses for the hall
 * map, availability lookups, and the create/extend/cancel actions.
 */
export function useBooking() {
  const { user, tables, bookings, createBilliardBooking, extendBilliardBooking, cancelBilliardBooking } =
    useAppState();
  const now = useNow();

  const myBookings: LiveBooking[] = useMemo(
    () =>
      bookings
        .filter((b) => b.userId === user.id)
        .map((b) => ({ ...b, liveStatus: deriveBookingStatus(b, now) }))
        .sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`)),
    [bookings, user.id, now]
  );

  const activeBooking = myBookings.find((b) => b.liveStatus === "active");

  const liveTables: BilliardTable[] = useMemo(
    () =>
      tables.map((t) => ({ ...t, status: deriveTableStatus(t, bookings, now) })),
    [tables, bookings, now]
  );

  function getTable(tableId: string): BilliardTable | undefined {
    return liveTables.find((t) => t.id === tableId);
  }

  function checkAvailable(
    tableId: string,
    date: string,
    startTime: string,
    duration: number,
    excludeBookingId?: string
  ): boolean {
    return isTableAvailable(tableId, date, startTime, duration, bookings, excludeBookingId);
  }

  function availabilityTimeline(tableId: string, date: string) {
    return getAvailabilityTimeline(tableId, date, bookings);
  }

  function extensionPrice(table: BilliardTable, extraMinutes: number): number {
    return getExtensionPrice(table, extraMinutes);
  }

  return {
    liveTables,
    myBookings,
    activeBooking,
    getTable,
    checkAvailable,
    availabilityTimeline,
    extensionPrice,
    createBilliardBooking,
    extendBilliardBooking,
    cancelBilliardBooking,
  };
}

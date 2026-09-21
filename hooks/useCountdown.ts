"use client";

import { useMemo } from "react";
import type { Booking } from "@/types";
import { combineDateTime, formatCountdown } from "@/lib/time";
import { useNow } from "./useNow";

export interface CountdownState {
  remainingMs: number;
  label: string;
  isActive: boolean;
  isUpcoming: boolean;
  isEnded: boolean;
  isEndingSoon15: boolean;
  isEndingSoon5: boolean;
}

/** Live countdown for a single booking, ticking off the shared clock. */
export function useCountdown(booking: Booking | undefined | null): CountdownState {
  const now = useNow();

  return useMemo(() => {
    if (!booking) {
      return {
        remainingMs: 0,
        label: "00:00:00",
        isActive: false,
        isUpcoming: false,
        isEnded: true,
        isEndingSoon15: false,
        isEndingSoon5: false,
      };
    }

    const start = combineDateTime(booking.date, booking.startTime);
    const end = combineDateTime(booking.date, booking.endTime);
    const remainingMs = end.getTime() - now.getTime();
    const isUpcoming = now < start;
    const isActive = now >= start && now < end;
    const isEnded = now >= end;

    return {
      remainingMs: Math.max(0, remainingMs),
      label: formatCountdown(remainingMs),
      isActive,
      isUpcoming,
      isEnded,
      isEndingSoon15: isActive && remainingMs <= 15 * 60_000,
      isEndingSoon5: isActive && remainingMs <= 5 * 60_000,
    };
  }, [booking, now]);
}

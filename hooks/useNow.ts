"use client";

import { useClock } from "@/context/AppStateContext";

/** Shared, once-a-second clock. Prefer this over `new Date()` in render so
 * every consumer stays in sync and there's only one interval for the app. */
export function useNow(): Date {
  return useClock();
}

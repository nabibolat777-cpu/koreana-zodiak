"use client";

/**
 * Global app state for the prototype.
 *
 * There is no backend yet (PRD #49 — "prototype can use local
 * state/mock services"), so this provider is the stand-in for what will
 * eventually be a real-time API (WebSockets / Supabase Realtime / custom
 * backend). It is deliberately split into two contexts:
 *
 *  - AppDataContext: tables, bookings, notifications and the actions that
 *    mutate them. Reference-stable via useMemo so pages that don't care
 *    about the clock don't re-render every second.
 *  - AppClockContext: a single ticking `now`, consumed only by whatever
 *    actually needs a live countdown (see hooks/useNow.ts).
 *
 * All booking mutations are routed through services/bookingService.ts so
 * the same conflict-protection and extension rules used here are exactly
 * what a future backend should re-implement server-side (PRD #69).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AppNotification,
  AppUser,
  BilliardTable,
  Booking,
  RestaurantBooking,
} from "@/types";
import { combineDateTime } from "@/lib/time";
import { BILLIARD_TABLES } from "@/data/tables";
import { buildSeedBookings } from "@/data/bookings";
import { MOCK_CURRENT_USER } from "@/data/user";
import {
  createBooking as createBookingLogic,
  extendBooking as extendBookingLogic,
  cancelBooking as cancelBookingLogic,
  deriveBookingStatus,
  type CreateBookingInput,
} from "@/services/bookingService";
import {
  InAppNotificationService,
  NotificationDispatcher,
  buildNotification,
} from "@/services/notificationService";
import type { BookingResult } from "@/types";

export interface RestaurantBookingInput {
  guestCount: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  comment?: string;
}

interface AppDataValue {
  user: AppUser;
  tables: BilliardTable[];
  bookings: Booking[];
  restaurantBookings: RestaurantBooking[];
  notifications: AppNotification[];
  unreadCount: number;
  createBilliardBooking: (
    input: Omit<CreateBookingInput, "userId">
  ) => BookingResult<Booking>;
  extendBilliardBooking: (
    bookingId: string,
    extraMinutes: number
  ) => BookingResult<Booking>;
  cancelBilliardBooking: (bookingId: string) => void;
  createRestaurantBooking: (
    input: RestaurantBookingInput
  ) => BookingResult<RestaurantBooking>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);
const AppClockContext = createContext<Date>(new Date());

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // Seed bookings are derived from `new Date()` (see data/bookings.ts), so
  // they must only be computed on the client — seeding them here (during
  // the initial render, which also runs on the server for SSR) would run
  // once on the server and again during client hydration at two different
  // instants, producing a server/client markup mismatch. Start empty and
  // populate in an effect, which only ever runs client-side after mount.
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [restaurantBookings, setRestaurantBookings] = useState<RestaurantBooking[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setBookings(buildSeedBookings());
  }, []);

  // Tick the shared clock once a second. Only AppClockContext consumers
  // re-render from this; AppDataContext stays referentially stable.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dispatcherRef = useRef<NotificationDispatcher | null>(null);
  if (!dispatcherRef.current) {
    const dispatcher = new NotificationDispatcher();
    dispatcher.register(
      new InAppNotificationService((n) => setNotifications((prev) => [n, ...prev]))
    );
    dispatcherRef.current = dispatcher;
  }

  // Tracks which auto-reminders already fired per booking so they are
  // only ever sent once (PRD #29-#31).
  const firedRef = useRef<Set<string>>(new Set());
  const lastStatusRef = useRef<Map<string, Booking["status"]>>(new Map());

  useEffect(() => {
    for (const booking of bookings) {
      if (booking.userId !== MOCK_CURRENT_USER.id) continue;
      const effective = deriveBookingStatus(booking, now);
      const previous = lastStatusRef.current.get(booking.id);

      if (previous !== "active" && effective === "active") {
        dispatcherRef.current?.dispatch(
          buildNotification("booking_started", booking.userId, booking)
        );
      }

      if (effective === "active") {
        const end = combineDateTime(booking.date, booking.endTime);
        const remainingMs = end.getTime() - now.getTime();

        const key15 = `${booking.id}:15min`;
        if (remainingMs <= 15 * 60_000 && remainingMs > 0 && !firedRef.current.has(key15)) {
          firedRef.current.add(key15);
          dispatcherRef.current?.dispatch(
            buildNotification("15_minutes", booking.userId, booking)
          );
        }

        const key5 = `${booking.id}:5min`;
        if (remainingMs <= 5 * 60_000 && remainingMs > 0 && !firedRef.current.has(key5)) {
          firedRef.current.add(key5);
          dispatcherRef.current?.dispatch(
            buildNotification("5_minutes", booking.userId, booking)
          );
        }
      }

      lastStatusRef.current.set(booking.id, effective);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, bookings]);

  const createBilliardBooking = useCallback<AppDataValue["createBilliardBooking"]>(
    (input) => {
      const result = createBookingLogic(
        { ...input, userId: MOCK_CURRENT_USER.id },
        bookings
      );
      if (result.ok && result.data) {
        setBookings((prev) => [...prev, result.data as Booking]);
        dispatcherRef.current?.dispatch(
          buildNotification("booking_confirmed", MOCK_CURRENT_USER.id, result.data)
        );
      }
      return result;
    },
    [bookings]
  );

  const extendBilliardBooking = useCallback<AppDataValue["extendBilliardBooking"]>(
    (bookingId, extraMinutes) => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) return { ok: false, error: "Бронирование не найдено." };

      const result = extendBookingLogic(booking, extraMinutes, bookings);
      if (result.ok && result.data) {
        const updated = result.data;
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
        dispatcherRef.current?.dispatch(
          buildNotification("booking_extended", MOCK_CURRENT_USER.id, updated)
        );
      }
      return result;
    },
    [bookings]
  );

  const cancelBilliardBooking = useCallback((bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? cancelBookingLogic(b) : b))
    );
    const booking = bookings.find((b) => b.id === bookingId);
    dispatcherRef.current?.dispatch(
      buildNotification("booking_cancelled", MOCK_CURRENT_USER.id, booking)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  const createRestaurantBooking = useCallback<AppDataValue["createRestaurantBooking"]>(
    (input) => {
      const booking: RestaurantBooking = {
        id: `rb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId: MOCK_CURRENT_USER.id,
        guestCount: input.guestCount,
        date: input.date,
        time: input.time,
        name: input.name,
        phone: input.phone,
        comment: input.comment,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      setRestaurantBookings((prev) => [...prev, booking]);
      dispatcherRef.current?.dispatch(
        buildNotification("restaurant_confirmed", MOCK_CURRENT_USER.id)
      );
      return { ok: true, data: booking };
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = useMemo<AppDataValue>(
    () => ({
      user: MOCK_CURRENT_USER,
      tables: BILLIARD_TABLES,
      bookings,
      restaurantBookings,
      notifications,
      unreadCount,
      createBilliardBooking,
      extendBilliardBooking,
      cancelBilliardBooking,
      createRestaurantBooking,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      bookings,
      restaurantBookings,
      notifications,
      unreadCount,
      createBilliardBooking,
      extendBilliardBooking,
      cancelBilliardBooking,
      createRestaurantBooking,
      markNotificationRead,
      markAllNotificationsRead,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>
      <AppClockContext.Provider value={now}>{children}</AppClockContext.Provider>
    </AppDataContext.Provider>
  );
}

export function useAppState(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function useClock(): Date {
  return useContext(AppClockContext);
}

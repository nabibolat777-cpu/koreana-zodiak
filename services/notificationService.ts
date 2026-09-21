/**
 * Notification abstraction (PRD #31-#33).
 *
 * `NotificationService` is a small provider interface so the prototype's
 * in-app channel can be joined later by Push / SMS / WhatsApp / Telegram /
 * Email providers without changing call sites — each provider implements
 * `send()` and is registered in `NotificationDispatcher`.
 */
import type { AppNotification, Booking, NotificationType } from "@/types";

export interface NotificationService {
  readonly channel: string;
  send(notification: AppNotification): Promise<void> | void;
}

/** Prototype channel: notifications are just appended to in-memory/app state. */
export class InAppNotificationService implements NotificationService {
  readonly channel = "in-app";
  private onDeliver: (n: AppNotification) => void;

  constructor(onDeliver: (n: AppNotification) => void) {
    this.onDeliver = onDeliver;
  }

  send(notification: AppNotification): void {
    this.onDeliver(notification);
  }
}

/** Fan-out to every registered provider — future providers (push/SMS/etc.)
 * are added here without touching booking/countdown logic. */
export class NotificationDispatcher {
  private providers: NotificationService[] = [];

  register(provider: NotificationService): void {
    this.providers.push(provider);
  }

  dispatch(notification: AppNotification): void {
    for (const provider of this.providers) {
      provider.send(notification);
    }
  }
}

const COPY: Record<
  NotificationType,
  (booking?: Booking) => { title: string; message: string }
> = {
  booking_confirmed: (b) => ({
    title: "Booking Confirmed",
    message: `Ваше бронирование стола ${b?.tableId ?? ""} подтверждено.`,
  }),
  booking_started: (b) => ({
    title: "Booking Started",
    message: "Ваша игра началась.",
  }),
  "15_minutes": () => ({
    title: "🔔 Игра скоро закончится",
    message: "Осталось 15 минут. Хотите продлить бронирование?",
  }),
  "5_minutes": () => ({
    title: "🔔 5 минут осталось",
    message: "Ваше бронирование заканчивается через 5 минут.",
  }),
  booking_extended: () => ({
    title: "Booking Extended",
    message: "Ваше бронирование продлено.",
  }),
  booking_cancelled: () => ({
    title: "Booking Cancelled",
    message: "Ваше бронирование отменено.",
  }),
  restaurant_confirmed: () => ({
    title: "Reservation Confirmed",
    message: "Ваш столик в ресторане подтверждён.",
  }),
};

export function buildNotification(
  type: NotificationType,
  userId: string,
  booking?: Booking
): AppNotification {
  const { title, message } = COPY[type](booking);
  return {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    type,
    title,
    message,
    createdAt: new Date().toISOString(),
    read: false,
    bookingId: booking?.id,
  };
}

export type NotificationType =
  | "booking_confirmed"
  | "booking_started"
  | "15_minutes"
  | "5_minutes"
  | "booking_extended"
  | "booking_cancelled"
  | "restaurant_confirmed";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  /** related booking, if any, so the UI can deep-link to "My Booking" */
  bookingId?: string;
}

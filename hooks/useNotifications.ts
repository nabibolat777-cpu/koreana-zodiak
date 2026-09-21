"use client";

import { useAppState } from "@/context/AppStateContext";

/** Current user's in-app notifications feed (PRD #31-#33). */
export function useNotifications() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, user } =
    useAppState();

  const mine = notifications.filter((n) => n.userId === user.id);

  return {
    notifications: mine,
    unreadCount,
    markRead: markNotificationRead,
    markAllRead: markAllNotificationsRead,
  };
}

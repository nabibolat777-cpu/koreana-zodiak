"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { clsx } from "@/lib/clsx";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ч назад`;
}

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label={`Уведомления${unreadCount ? `, ${unreadCount} новых` : ""}`}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        className="relative rounded-sm p-2 text-warmwhite-dim transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy-600 text-[10px] font-semibold text-warmwhite"
            aria-hidden
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="dialog"
            aria-label="Уведомления"
            className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-md border border-charcoal-700 bg-charcoal-900 shadow-card"
          >
            <div className="border-b border-charcoal-700 px-4 py-3">
              <p className="text-sm font-medium text-warmwhite">Уведомления</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-warmwhite-dim">
                  Пока нет уведомлений.
                </p>
              ) : (
                <ul>
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={clsx(
                        "cursor-pointer border-b border-charcoal-800 px-4 py-3 hover:bg-charcoal-800/60",
                        !n.read && "bg-charcoal-800/30"
                      )}
                    >
                      <p className="text-sm font-medium text-warmwhite">{n.title}</p>
                      <p className="mt-0.5 text-xs text-warmwhite-dim">{n.message}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-warmwhite-dim/50">
                        {timeAgo(n.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

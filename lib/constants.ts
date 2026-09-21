/**
 * Central place for labels/copy that appear in more than one component,
 * so status wording and navigation stay consistent and are easy to
 * localize later (PRD #74 — architecture should support RU/KK/EN).
 */
import type { TableStatus } from "@/types";

export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/restaurant", label: "Ресторан" },
  { href: "/menu", label: "Меню" },
  { href: "/menu#best-sellers", label: "Хиты" },
  { href: "/billiard", label: "Бильярд" },
  { href: "/account", label: "Мои бронирования" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const TABLE_STATUS_LABEL: Record<TableStatus, string> = {
  available: "Свободен",
  occupied: "Занят",
  reserved: "Забронирован",
  closed: "Недоступен",
};

export const TABLE_STATUS_EMOJI: Record<TableStatus, string> = {
  available: "🟢",
  occupied: "🔴",
  reserved: "🟡",
  closed: "⚪",
};

export const TABLE_TYPE_LABEL = {
  russian: "Русский бильярд",
  pool: "Пул",
} as const;

export const VENUE_CONTACT = {
  address: "ул. Кажымукана, 3, Астана",
  city: "Астана, Казахстан",
  hoursNote: "12:00 – 02:00 (демо-данные)",
};

export const EXTENSION_OPTIONS = [30, 60, 120] as const;

/**
 * Small, dependency-free date/time helpers shared by services, hooks and
 * components. Everything here works with plain "YYYY-MM-DD" dates and
 * "HH:mm" times in the venue's local time (Asia/Almaty), which is enough
 * for a client-only prototype. A real backend integration should replace
 * this with a proper timezone-aware library (e.g. date-fns-tz, luxon).
 */

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes: number): string {
  const clamped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

export function addMinutes(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

/** Combine a YYYY-MM-DD date and HH:mm time into a real Date instance. */
export function combineDateTime(date: string, time: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return new Date(y, (mo ?? 1) - 1, d ?? 1, h ?? 0, mi ?? 0, 0, 0);
}

export function isSameDate(a: string, b: string): boolean {
  return a === b;
}

/** Returns the next `count` days (including today) as ISO date strings. */
export function upcomingDates(count = 5, from: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    out.push(toISODate(d));
  }
  return out;
}

const RU_MONTHS_SHORT = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

/** "Today" / "Tomorrow" / "25 авг" style label for date chips. */
export function formatDateChip(iso: string, today = todayISO()): string {
  const d = new Date(iso + "T00:00:00");
  const t = new Date(today + "T00:00:00");
  const diffDays = Math.round((d.getTime() - t.getTime()) / 86_400_000);
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Завтра";
  return `${d.getDate()} ${RU_MONTHS_SHORT[d.getMonth()]}`;
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

export function formatMoney(amount: number, currency = "₸"): string {
  return `${amount.toLocaleString("ru-RU")} ${currency}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${start}–${end}`;
}

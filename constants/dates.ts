/** Tiny date helpers for the booking flow. Local time, day-resolution only. */

export const DAY_MS = 86_400_000;

export function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function addDays(d: Date, n: number) {
  const c = startOfDay(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function nightsBetween(a: Date, b: Date) {
  return Math.max(1, Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS));
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBetween(d: Date, a: Date, b: Date) {
  const t = startOfDay(d).getTime();
  return t > startOfDay(a).getTime() && t < startOfDay(b).getTime();
}

/** "27 Aug" */
export function fmtShort(d: Date) {
  return d.toLocaleDateString('en-PH', { day: 'numeric', month: 'short' });
}

/** "Tue 27 Aug" */
export function fmtWithWeekday(d: Date) {
  return d.toLocaleDateString('en-PH', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** "27 – 29 Aug" or "29 Aug – 2 Sep" */
export function fmtRange(a: Date, b: Date) {
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  return sameMonth
    ? `${a.getDate()} – ${fmtShort(b)}`
    : `${fmtShort(a)} – ${fmtShort(b)}`;
}

export function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString('en-PH', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Calendar grid for a month: leading nulls pad to the correct weekday,
 * Monday-first (Philippine convention).
 */
export function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Sun=0 -> Mon-first
  const cells: (Date | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * Resend mail leaves only while America/Phoenix is in [05:00, 17:00).
 * Outside that window the message is scheduled for the next 05:00.
 * The clock is the America/Phoenix zone (MST, UTC−7, no daylight saving),
 * not the server's local time.
 *
 * Resend accepts scheduledAt up to 30 days ahead. The longest wait here is 12 hours.
 */

export const SEND_TIME_ZONE = "America/Phoenix";
export const SEND_WINDOW_OPEN_HOUR = 5;
export const SEND_WINDOW_CLOSE_HOUR = 17;

/**
 * Resend documents one minute as the shortest schedule. When 05:00 is closer
 * than that, schedule a minute from now, which is still inside the open window.
 */
export const SCHEDULE_LEAD_MS = 60_000;

export const SEND_WINDOW_OPEN_LABEL = formatHour(SEND_WINDOW_OPEN_HOUR);
export const SEND_WINDOW_CLOSE_LABEL = formatHour(SEND_WINDOW_CLOSE_HOUR);
export const SEND_WINDOW_ZONE_LABEL = "Phoenix time";
export const SEND_WINDOW_RANGE_LABEL = `${SEND_WINDOW_OPEN_LABEL} until ${SEND_WINDOW_CLOSE_LABEL} ${SEND_WINDOW_ZONE_LABEL}`;

type WallTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export function isSendWindowOpen(instant: Date): boolean {
  const wall = wallTime(instant);
  return wall.hour >= SEND_WINDOW_OPEN_HOUR && wall.hour < SEND_WINDOW_CLOSE_HOUR;
}

/** Next 05:00:00 America/Phoenix, or null when `instant` is already inside the window. */
export function nextWindowOpen(instant: Date): Date | null {
  if (isSendWindowOpen(instant)) return null;
  const wall = wallTime(instant);
  if (wall.hour < SEND_WINDOW_OPEN_HOUR) {
    return wallToUtc({ ...wall, hour: SEND_WINDOW_OPEN_HOUR, minute: 0, second: 0 });
  }
  const tomorrow = addDays(wall, 1);
  return wallToUtc({ ...tomorrow, hour: SEND_WINDOW_OPEN_HOUR, minute: 0, second: 0 });
}

/** ISO timestamp for Resend scheduledAt, or null when the message should go now. */
export function scheduledSendAt(instant: Date): string | null {
  const open = nextWindowOpen(instant);
  if (!open) return null;
  const when = Math.max(open.getTime(), instant.getTime() + SCHEDULE_LEAD_MS);
  return new Date(when).toISOString();
}

export type MailDelivery = {
  scheduledAt: string | null;
  /** When a confirmation link's 48 hours start. Matches the scheduled send. */
  tokenFrom: number;
};

export function mailDelivery(instant: Date): MailDelivery {
  const scheduledAt = scheduledSendAt(instant);
  return {
    scheduledAt,
    tokenFrom: scheduledAt ? Date.parse(scheduledAt) : instant.getTime()
  };
}

function formatHour(hour: number): string {
  const suffix = hour < 12 ? "AM" : "PM";
  const clock = hour % 12 === 0 ? 12 : hour % 12;
  return `${clock}:00 ${suffix}`;
}

function wallTime(instant: Date): WallTime {
  if (Number.isNaN(instant.getTime())) throw new Error("Send window time was invalid");
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SEND_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes): number => {
    const value = parts.find((part) => part.type === type)?.value;
    if (!value) throw new Error(`Missing ${type} in ${SEND_TIME_ZONE}`);
    return Number(value);
  };
  let hour = read("hour");
  let year = read("year");
  let month = read("month");
  let day = read("day");
  const minute = read("minute");
  const second = read("second");
  if (hour === 24) {
    hour = 0;
    const rolled = addDays({ year, month, day, hour, minute, second }, 1);
    year = rolled.year;
    month = rolled.month;
    day = rolled.day;
  }
  return { year, month, day, hour, minute, second };
}

function addDays(wall: WallTime, days: number): WallTime {
  const shifted = new Date(Date.UTC(wall.year, wall.month - 1, wall.day + days));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: wall.hour,
    minute: wall.minute,
    second: wall.second
  };
}

function wallToUtc(wall: WallTime): Date {
  const guess = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second);
  const first = guess - zoneOffsetMs(new Date(guess));
  const second = guess - zoneOffsetMs(new Date(first));
  return new Date(second);
}

function zoneOffsetMs(instant: Date): number {
  const wall = wallTime(instant);
  const wallAsUtc = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second);
  const wholeSecond = instant.getTime() - (instant.getTime() % 1000);
  return wallAsUtc - wholeSecond;
}

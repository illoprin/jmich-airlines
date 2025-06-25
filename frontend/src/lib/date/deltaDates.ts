import { parseISO8601 } from "@/lib/date/parseDate";

const minuteMilliseconds = 1000 * 60;

export interface DatesDelta {
  days: number;
  hours: number;
  minutes: string;
}

/**
 * Calculates difference between two dates
 * in milliseconds
 * @param a - a value ISO8601 date string
 * @param b - b value ISO8601 date string
 * @returns difference in milliseconds
 * value can be negative
 */
export function deltaTime(a: string, b: string): number | null {
  const aDate = parseISO8601(a);
  const bDate = parseISO8601(b);
  if (!aDate || !bDate) return null;
  return aDate.getTime() - bDate.getTime();
}

/**
 * Calculates difference between two dates
 * @param a - a value ISO8601 date string
 * @param b - b value ISO8601 date string
 * @returns formatted date ABSOLUTE difference
 */
export function deltaDate(a: string, b: string): DatesDelta | null {
  let millisecondsDelta = deltaTime(a, b);
  if (!millisecondsDelta) return null;
  millisecondsDelta = Math.abs(millisecondsDelta);

  let minutes = Math.ceil(millisecondsDelta / minuteMilliseconds);
  let hours = minutes / 60;
  const minutesFromLastHour = Math.floor((hours - Math.floor(hours)) * 60);
  hours = Math.floor(hours);

  let days = Math.floor(hours / 24);
  hours -= days * 24;


  return {
    hours, 
    days,
    minutes: String(minutesFromLastHour).padStart(2, '0'),
  };
}
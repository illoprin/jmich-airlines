import { parseDate, parseISO8601, type DateParsed } from "@/lib/date/parseDate";

const minuteMilliseconds = 1000 * 60;

export interface DatesDelta {
  days: number;
  hours: number;
  minutes: string;
}

/**
 * Calculates difference of two dates
 * @param a - a value ISO8601 date string
 * @param b - b value ISO8601 date string
 * @returns date delta value
 */
export function deltaDate(a: string, b: string): DatesDelta | null {
  const aDate = parseISO8601(a);
  const bDate = parseISO8601(b);
  if (!aDate || !bDate) return null;
  const millisecondsDelta = Math.abs(aDate.getTime() - bDate.getTime());

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
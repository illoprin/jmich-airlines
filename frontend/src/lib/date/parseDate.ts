const Months_RU: Record<number, string> = {
  1: "Январь",
  2: "Февраль",
  3: "Март",
  4: "Апрель",
  5: "Май",
  6: "Июнь",
  7: "Июль",
  8: "Август",
  9: "Сентябрь",
  10: "Октябрь",
  11: "Ноябрь",
  12: "Декабрь",
}

interface DateParsed {
  seconds: number;
  minutes: string;
  hours: number;
  days: number;
  month: number;
  year: number;
}

function parseISO8601(dateString: string): Date | null {
  const date = new Date(dateString)
  return !isNaN(date.getTime()) ? date : null;
}

function parseDate(dateString: string): DateParsed {
  const date = new Date(dateString);
  return {
    seconds: date.getSeconds(),
    minutes: String(date.getMinutes()).padStart(2, "0"),
    hours: date.getHours(),
    days: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear()
  }
}

export { type DateParsed, parseDate, Months_RU, parseISO8601 }
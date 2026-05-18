import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import type { AppEvent, EventStatus } from "../model/types";

export function formatDDayLabel(status: EventStatus): string {
  switch (status.kind) {
    case "upcoming":
      return `D-${status.days}`;
    case "ongoing":
      return "진행중";
    case "past":
      return `D+${status.daysSinceEnd}`;
  }
}

export function formatEventPeriod(event: AppEvent): string {
  const start = format(parseISO(event.startDate), "yyyy.MM.dd(E)", {
    locale: ko,
  });
  if (!event.endDate || event.endDate === event.startDate) return start;
  const end = format(parseISO(event.endDate), "MM.dd(E)", { locale: ko });
  return `${start} ~ ${end}`;
}

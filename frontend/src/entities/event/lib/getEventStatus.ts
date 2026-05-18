import { differenceInCalendarDays, parseISO } from "date-fns";
import { getNow } from "@shared/lib/utils";
import type { AppEvent, EventStatus } from "../model/types";

export function getEventStatus(event: AppEvent): EventStatus {
  const now = getNow();
  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate ?? event.startDate);
  const toStart = differenceInCalendarDays(start, now);
  const toEnd = differenceInCalendarDays(end, now);

  if (toStart > 0) return { kind: "upcoming", days: toStart };
  if (toEnd >= 0) return { kind: "ongoing", daysToEnd: toEnd };
  return { kind: "past", daysSinceEnd: Math.abs(toEnd) };
}

import type { AppEvent, EventStatus } from "../model/types";
import { getEventStatus } from "./getEventStatus";

type UpcomingEntry = {
  event: AppEvent;
  status: Extract<EventStatus, { kind: "upcoming" }>;
};

// 정책 A: 진행중 1순위 → 다가오는 가장 가까운 미래 → 둘 다 없으면 null
export function selectCurrentEvent(events: AppEvent[]): AppEvent | null {
  const withStatus = events.map((event) => ({
    event,
    status: getEventStatus(event),
  }));

  const ongoing = withStatus.find((x) => x.status.kind === "ongoing");
  if (ongoing) return ongoing.event;

  const upcoming = withStatus.filter(
    (x): x is UpcomingEntry => x.status.kind === "upcoming",
  );
  const closest = [...upcoming].sort(
    (a, b) => a.status.days - b.status.days,
  )[0];

  return closest?.event ?? null;
}

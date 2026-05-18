export interface AppEvent {
  name: string;
  startDate: string;
  endDate?: string;
}

export type EventStatus =
  | { kind: "upcoming"; days: number }
  | { kind: "ongoing"; daysToEnd: number }
  | { kind: "past"; daysSinceEnd: number };

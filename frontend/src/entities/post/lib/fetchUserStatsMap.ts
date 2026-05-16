import { createClient } from "@shared/api/supabase/client";
import { parseDate } from "@shared/lib/utils";
import { format } from "date-fns";
import { computeUserBadges } from "./badge";

const EARLY_BIRD_HOUR = 6;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const STREAK_MAX_GAP_DAYS = 2;

interface UserActivityEntry {
  dates: Set<string>;
  earlyCount: number;
}

function groupActivityByUser(
  rows: { user_id: string; created_at: string }[],
): Map<string, UserActivityEntry> {
  const byUser = new Map<string, UserActivityEntry>();
  for (const row of rows) {
    if (!byUser.has(row.user_id)) {
      byUser.set(row.user_id, { dates: new Set(), earlyCount: 0 });
    }
    const entry = byUser.get(row.user_id)!;
    const d = parseDate(row.created_at);
    entry.dates.add(format(d, "yyyy-MM-dd"));
    if (d.getHours() < EARLY_BIRD_HOUR) entry.earlyCount++;
  }
  return byUser;
}

function calculateMaxStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;
  let maxStreak = 0;
  let currentRun = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = parseDate(sortedDates[i - 1]);
    const curr = parseDate(sortedDates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / MS_PER_DAY);
    if (diffDays <= STREAK_MAX_GAP_DAYS) {
      currentRun++;
    } else {
      maxStreak = Math.max(maxStreak, currentRun);
      currentRun = 1;
    }
  }
  return Math.max(maxStreak, currentRun);
}

export async function fetchUserStatsMap(
  userIds: string[],
): Promise<Map<string, string[]>> {
  if (userIds.length === 0) return new Map();

  const supabase = createClient();
  const { data } = await supabase
    .from("oq_user_qt_answers")
    .select("user_id, created_at")
    .in("user_id", userIds)
    .order("created_at", { ascending: true });
  if (!data) return new Map();

  const byUser = groupActivityByUser(data);
  const result = new Map<string, string[]>();

  for (const [uid, entry] of byUser) {
    const sortedDates = Array.from(entry.dates).sort();
    result.set(
      uid,
      computeUserBadges({
        postCount: entry.dates.size,
        maxStreak: calculateMaxStreak(sortedDates),
        earlyBirdCount: entry.earlyCount,
      }),
    );
  }

  return result;
}

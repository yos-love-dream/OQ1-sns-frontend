import { createClient } from "@shared/api/supabase/client";
import { getStartOfToday } from "@shared/lib/utils";

export interface UserActivityRow {
  user_id: string;
  created_at: string;
}

export async function fetchUserActivityRows(
  userIds: string[],
): Promise<UserActivityRow[]> {
  if (userIds.length === 0) return [];

  const supabase = createClient();
  const { data } = await supabase
    .from("oq_user_qt_answers")
    .select("user_id, created_at")
    .in("user_id", userIds)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function fetchActiveUserIdsToday(
  userIds?: string[],
): Promise<Set<string>> {
  const supabase = createClient();
  const startOfToday = getStartOfToday();

  let query = supabase
    .from("oq_user_qt_answers")
    .select("user_id")
    .gte("created_at", startOfToday.toISOString());

  if (userIds && userIds.length > 0) {
    query = query.in("user_id", userIds);
  }

  const { data } = await query;
  return new Set(data?.map((item) => item.user_id) ?? []);
}

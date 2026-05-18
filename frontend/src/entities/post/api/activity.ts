import { createClient } from "@shared/api/supabase/client";
import { unwrap } from "@shared/api/supabase/unwrap";
import { getStartOfToday } from "@shared/lib/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { UserActivityRowSchema, UserIdRowSchema } from "./schemas";

export type UserActivityRow = z.infer<typeof UserActivityRowSchema>;

export async function fetchUserActivityRows(
  userIds: string[],
  client?: SupabaseClient,
): Promise<UserActivityRow[]> {
  if (userIds.length === 0) return [];

  const supabase = client ?? createClient();
  return unwrap(
    supabase
      .from("oq_user_qt_answers")
      .select("user_id, created_at")
      .in("user_id", userIds)
      .order("created_at", { ascending: true }),
    z.array(UserActivityRowSchema),
  );
}

export async function fetchActiveUserIdsToday(
  userIds?: string[],
  client?: SupabaseClient,
): Promise<Set<string>> {
  const supabase = client ?? createClient();
  const startOfToday = getStartOfToday();

  let query = supabase
    .from("oq_user_qt_answers")
    .select("user_id")
    .gte("created_at", startOfToday.toISOString());

  if (userIds && userIds.length > 0) {
    query = query.in("user_id", userIds);
  }

  const rows = await unwrap(query, z.array(UserIdRowSchema));
  return new Set(rows.map((item) => item.user_id));
}

import { createClient } from "@shared/api/supabase/client";
import { formatLineBreaks, getNow, parseDate } from "@shared/lib/utils";
import type { Post } from "@shared/types";
import { format } from "date-fns";
import { fetchUserStatsMap } from "../lib/fetchUserStatsMap";
import {
  getActiveUserIdsToday,
  mapQtAnswerToPost,
  mapUserPostToPost,
} from "../lib/mapToPost";
import type {
  DBReactionRow,
  QtAnswerRow,
  UserPostRow,
} from "../model/types";

const REACTION_LIMIT = 3;

export async function fetchPosts(
  currentUserId: string | null,
): Promise<Post[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("oq_user_qt_answers")
    .select(
      `
      id, meditation, created_at, is_public, user_id,
      user:oq_users!user_id ( id, user_name, guk_no, avatar_url, enneagram_type ),
      daily_qt:oq_daily_qt ( bible_book, chapter, verse_from, verse_to, content ),
      likes:oq_qt_likes( user_id, user:oq_users!user_id(user_name, avatar_url) ),
      comments:oq_qt_comments(count),
      liked_by_me:oq_qt_likes(user_id)
    `,
    )
    .eq("is_public", true)
    .or("is_hidden.is.null,is_hidden.eq.false")
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("Error fetching posts:", error);
    return [];
  }

  const rows = data as unknown as QtAnswerRow[];
  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const [activeUserIds, badgesMap] = await Promise.all([
    getActiveUserIdsToday(),
    fetchUserStatsMap(userIds),
  ]);
  return rows.map((row) =>
    mapQtAnswerToPost(row, { activeUserIds, currentUserId, badgesMap }),
  );
}

export async function fetchUserProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("oq_users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    if (error) console.error("Error fetching user profile:", error);
    return null;
  }

  return {
    ...data,
    avatar_url: data.avatar_url || "",
  };
}

export async function fetchUserPosts(
  userId: string,
  isOwnProfile: boolean,
): Promise<Post[]> {
  const supabase = createClient();

  let query = supabase
    .from("oq_user_qt_answers")
    .select(
      `
      id, created_at, meditation, is_public, user_id,
      oq_daily_qt!inner ( qt_date, bible_book, chapter, verse_from, verse_to, content ),
      likes:oq_qt_likes( user_id, user:oq_users!user_id(user_name, avatar_url) ),
      comments:oq_qt_comments(count),
      liked_by_me:oq_qt_likes(user_id)
    `,
    )
    .eq("user_id", userId);

  if (!isOwnProfile) {
    query = query.eq("is_public", true);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("Error fetching user posts:", error);
    return [];
  }

  const [activeUserIds, badgesMap] = await Promise.all([
    getActiveUserIdsToday([userId]),
    fetchUserStatsMap([userId]),
  ]);
  return (data as unknown as UserPostRow[]).map((row) =>
    mapUserPostToPost(row, {
      activeUserIds,
      currentUserId: userId,
      badgesMap,
    }),
  );
}

export async function fetchRecentReactions(userId: string, postIds: string[]) {
  const supabase = createClient();

  const fetchReactions = async (table: string): Promise<DBReactionRow[]> => {
    const { data } = await supabase
      .from(table)
      .select("id, created_at, user:oq_users!inner(user_name)")
      .in("answer_id", postIds)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(REACTION_LIMIT);
    return (data as unknown as DBReactionRow[]) || [];
  };

  const mapReaction = (row: DBReactionRow, type: "like" | "comment") => ({
    id: row.id,
    type,
    user_name: row.user?.user_name || "알 수 없음",
    created_at: row.created_at,
  });

  const [likes, comments] = await Promise.all([
    fetchReactions("oq_qt_likes"),
    fetchReactions("oq_qt_comments"),
  ]);

  return [
    ...likes.map((l) => mapReaction(l, "like")),
    ...comments.map((c) => mapReaction(c, "comment")),
  ]
    .sort(
      (a, b) =>
        parseDate(b.created_at).getTime() - parseDate(a.created_at).getTime(),
    )
    .slice(0, REACTION_LIMIT);
}

export async function fetchTodayQt() {
  const supabase = createClient();
  const todayStr = format(getNow(), "yyyy-MM-dd");

  const { data: todayQt } = await supabase
    .from("oq_daily_qt")
    .select("*")
    .eq("qt_date", todayStr)
    .single();

  const qtData =
    todayQt ??
    (
      await supabase
        .from("oq_daily_qt")
        .select("*")
        .order("qt_date", { ascending: false })
        .limit(1)
        .single()
    ).data;

  return qtData
    ? { ...qtData, content: formatLineBreaks(qtData.content) }
    : null;
}

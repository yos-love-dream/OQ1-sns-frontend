import { createClient } from "@shared/api/supabase/client";
import { assertOk, unwrap } from "@shared/api/supabase/unwrap";
import { parseDate } from "@shared/lib/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Post } from "../model/types";
import { fetchActiveUserIdsToday } from "./activity";
import { fetchUserStatsMap } from "../lib/fetchUserStatsMap";
import { mapQtAnswerToPost, mapUserPostToPost } from "../lib/mapToPost";
import {
  DBLikeRowSchema,
  DBReactionRowSchema,
  QtAnswerRowSchema,
  UserPostRowSchema,
  type DBLikeRow,
  type DBReactionRow,
} from "./schemas";

const REACTION_LIMIT = 3;

export async function fetchPosts(
  currentUserId: string | null,
  client?: SupabaseClient,
): Promise<Post[]> {
  const supabase = client ?? createClient();

  const rows = await unwrap(
    supabase
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
      .order("created_at", { ascending: false }),
    z.array(QtAnswerRowSchema),
  );

  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const [activeUserIds, badgesMap] = await Promise.all([
    fetchActiveUserIdsToday(undefined, supabase),
    fetchUserStatsMap(userIds, supabase),
  ]);
  return rows.map((row) =>
    mapQtAnswerToPost(row, {
      activeUserIds,
      currentUserId,
      badgesMap,
    }),
  );
}

export async function fetchUserPosts(
  userId: string,
  isOwnProfile: boolean,
  client?: SupabaseClient,
): Promise<Post[]> {
  const supabase = client ?? createClient();

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

  const rows = await unwrap(
    query.order("created_at", { ascending: false }),
    z.array(UserPostRowSchema),
  );

  const [activeUserIds, badgesMap] = await Promise.all([
    fetchActiveUserIdsToday([userId], supabase),
    fetchUserStatsMap([userId], supabase),
  ]);
  return rows.map((row) =>
    mapUserPostToPost(row, {
      activeUserIds,
      currentUserId: userId,
      badgesMap,
    }),
  );
}

export async function likePost(postId: string, userId: string): Promise<void> {
  const supabase = createClient();
  await assertOk(
    supabase
      .from("oq_qt_likes")
      .insert({ user_id: userId, answer_id: postId }),
  );
}

export async function unlikePost(
  postId: string,
  userId: string,
): Promise<void> {
  const supabase = createClient();
  await assertOk(
    supabase
      .from("oq_qt_likes")
      .delete()
      .eq("user_id", userId)
      .eq("answer_id", postId),
  );
}

export async function deletePost(
  postId: string,
  userId: string,
): Promise<void> {
  const supabase = createClient();
  await assertOk(
    supabase
      .from("oq_user_qt_answers")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId),
  );
}

export async function reportPost(postId: string): Promise<void> {
  const supabase = createClient();
  await assertOk(supabase.rpc("report_answer", { answer_id: postId }));
}

async function fetchRecentLikes(
  userId: string,
  postIds: string[],
): Promise<DBLikeRow[]> {
  const supabase = createClient();
  return unwrap(
    supabase
      .from("oq_qt_likes")
      .select("user_id, answer_id, created_at, user:oq_users!inner(user_name)")
      .in("answer_id", postIds)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(REACTION_LIMIT),
    z.array(DBLikeRowSchema),
  );
}

async function fetchRecentComments(
  userId: string,
  postIds: string[],
): Promise<DBReactionRow[]> {
  const supabase = createClient();
  return unwrap(
    supabase
      .from("oq_qt_comments")
      .select(
        "id, answer_id, content, created_at, user:oq_users!inner(user_name)",
      )
      .in("answer_id", postIds)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(REACTION_LIMIT),
    z.array(DBReactionRowSchema),
  );
}

export async function fetchRecentReactions(userId: string, postIds: string[]) {
  const [likes, comments] = await Promise.all([
    fetchRecentLikes(userId, postIds),
    fetchRecentComments(userId, postIds),
  ]);

  const userName = (u: { user_name: string } | null | undefined) =>
    u?.user_name || "알 수 없음";

  return [
    ...likes.map((l) => ({
      id: `${l.user_id}:${l.answer_id}`,
      type: "like" as const,
      post_id: l.answer_id,
      content: null as string | null,
      user_name: userName(l.user),
      created_at: l.created_at,
    })),
    ...comments.map((c) => ({
      id: c.id,
      type: "comment" as const,
      post_id: c.answer_id,
      content: c.content,
      user_name: userName(c.user),
      created_at: c.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        parseDate(b.created_at).getTime() - parseDate(a.created_at).getTime(),
    )
    .slice(0, REACTION_LIMIT);
}

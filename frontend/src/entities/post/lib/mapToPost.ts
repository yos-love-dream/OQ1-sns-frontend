import { createClient } from "@shared/api/supabase/client";
import { formatLineBreaks, getStartOfToday } from "@shared/lib/utils";
import type { Post } from "@shared/types";
import type { QtAnswerRow, UserPostRow } from "../model/types";

const DEFAULT_LEVEL = 1;
const DEFAULT_MAX_EXP = 100;

interface MapToPostOptions {
  activeUserIds: Set<string>;
  currentUserId: string | null;
  badgesMap: Map<string, string[]>;
}

interface NormalizedSource {
  id: string;
  meditation: string;
  is_public: boolean;
  created_at: string;
  userId: string;
  user: QtAnswerRow["user"];
  dailyQt: QtAnswerRow["daily_qt"] | UserPostRow["oq_daily_qt"];
  likes: QtAnswerRow["likes"];
  comments: QtAnswerRow["comments"];
  likedByMe: QtAnswerRow["liked_by_me"];
}

function normalizeQtAnswerRow(row: QtAnswerRow): NormalizedSource {
  return {
    id: row.id,
    meditation: row.meditation,
    is_public: row.is_public,
    created_at: row.created_at,
    userId: row.user_id,
    user: row.user,
    dailyQt: row.daily_qt,
    likes: row.likes,
    comments: row.comments,
    likedByMe: row.liked_by_me,
  };
}

function normalizeUserPostRow(row: UserPostRow): NormalizedSource {
  return {
    id: row.id,
    meditation: row.meditation,
    is_public: row.is_public,
    created_at: row.created_at,
    userId: row.user_id || "",
    user: null,
    dailyQt: row.oq_daily_qt,
    likes: row.likes,
    comments: row.comments,
    likedByMe: row.liked_by_me,
  };
}

function buildPost(source: NormalizedSource, opts: MapToPostOptions): Post {
  const { user, userId, dailyQt, likes, comments, likedByMe } = source;
  const isLikedByMe = !!(
    opts.currentUserId &&
    likedByMe?.some((like) => like.user_id === opts.currentUserId)
  );

  return {
    id: source.id,
    user: {
      id: userId,
      name: user?.user_name || "",
      avatar: user?.avatar_url || "",
      type: "Anytime",
      streak: 0,
      group: user ? `${user.guk_no}국` : "",
      level: DEFAULT_LEVEL,
      currentExp: 0,
      maxExp: DEFAULT_MAX_EXP,
      hasDoneToday: opts.activeUserIds.has(userId),
      enneagramType: user?.enneagram_type,
      badges: opts.badgesMap.get(userId) || [],
    },
    content: source.meditation,
    scriptureRef: dailyQt
      ? `${dailyQt.bible_book} ${dailyQt.chapter}:${dailyQt.verse_from}-${dailyQt.verse_to}`
      : "말씀 정보 없음",
    scriptureContent: formatLineBreaks(dailyQt?.content),
    scriptureTitle: dailyQt
      ? `${dailyQt.bible_book} ${dailyQt.chapter}장`
      : undefined,
    amenCount: likes?.length || 0,
    likedUsers:
      likes?.map((l) => ({
        userId: l.user_id,
        userName: l.user?.user_name || "알 수 없음",
        avatarUrl: l.user?.avatar_url,
      })) ?? [],
    commentCount: comments?.[0]?.count || 0,
    isLiked: isLikedByMe,
    timestamp: source.created_at,
    tags: [],
    isAnonymous: !source.is_public,
    imageUrl: undefined,
  };
}

export function mapQtAnswerToPost(
  row: QtAnswerRow,
  opts: MapToPostOptions,
): Post {
  return buildPost(normalizeQtAnswerRow(row), opts);
}

export function mapUserPostToPost(
  row: UserPostRow,
  opts: MapToPostOptions,
): Post {
  return buildPost(normalizeUserPostRow(row), opts);
}

export async function getActiveUserIdsToday(
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
  return new Set(data?.map((item) => item.user_id) || []);
}

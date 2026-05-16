import { parseDate } from "@shared/lib/utils";
import type { Post } from "@shared/types";
import { useMemo } from "react";
import { calculateStreaks } from "./streaks";

const EARLY_BIRD_HOUR = 6;
const DAY_END_HOUR = 18;

export type TimePreference = "Morning" | "Night";

export interface ProfileStats {
  postCount: number;
  streak: number;
  maxStreak: number;
  earlyBirdCount: number;
  preferredType: TimePreference;
}

export interface ProfileStatsResult {
  activityDates: string[];
  hasDoneToday: boolean;
  stats: ProfileStats;
  posts: Post[];
}

interface ProfileLike {
  user_name?: string | null;
  avatar_url?: string | null;
}

const EMPTY_RESULT: ProfileStatsResult = {
  activityDates: [],
  hasDoneToday: false,
  stats: {
    postCount: 0,
    streak: 0,
    maxStreak: 0,
    earlyBirdCount: 0,
    preferredType: "Morning",
  },
  posts: [],
};

export function useProfileStats(
  rawPosts: Post[] | undefined,
  profile: ProfileLike | undefined,
): ProfileStatsResult {
  return useMemo(() => {
    if (!rawPosts || rawPosts.length === 0) return EMPTY_RESULT;

    const dates: string[] = [];
    let earlyCount = 0;
    let dayCount = 0;
    let nightCount = 0;
    let doneToday = false;

    for (const post of rawPosts) {
      dates.push(post.timestamp.split("T")[0]);
      const hour = parseDate(post.timestamp).getHours();
      if (hour < EARLY_BIRD_HOUR) earlyCount++;
      if (hour >= EARLY_BIRD_HOUR && hour < DAY_END_HOUR) dayCount++;
      else nightCount++;
      if (post.user.hasDoneToday) doneToday = true;
    }

    const preferredType: TimePreference =
      nightCount > dayCount ? "Night" : "Morning";

    const { current: currentStreak, max: maxStreak } = calculateStreaks(dates);

    const posts = rawPosts.map((post) => ({
      ...post,
      user: {
        ...post.user,
        name: profile?.user_name || "사용자",
        avatar: profile?.avatar_url || post.user.avatar,
        type: preferredType as Post["user"]["type"],
        streak: currentStreak,
      },
    })) as Post[];

    return {
      activityDates: dates,
      hasDoneToday: doneToday,
      stats: {
        postCount: rawPosts.length,
        streak: currentStreak,
        maxStreak,
        earlyBirdCount: earlyCount,
        preferredType,
      },
      posts,
    };
  }, [rawPosts, profile]);
}

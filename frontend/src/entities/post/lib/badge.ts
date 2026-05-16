const SHORT_STREAK_THRESHOLD = 3;
const WEEK_STREAK_THRESHOLD = 7;
const EARLY_BIRD_COUNT_THRESHOLD = 10;
const MASTER_POST_COUNT_THRESHOLD = 100;

export interface UserStats {
  postCount: number;
  maxStreak: number;
  earlyBirdCount: number;
}

export function computeUserBadges(stats: UserStats): string[] {
  const badges: string[] = [];
  if (stats.maxStreak >= SHORT_STREAK_THRESHOLD) badges.push("🌱");
  if (stats.maxStreak >= WEEK_STREAK_THRESHOLD) badges.push("🔥");
  if (stats.earlyBirdCount >= EARLY_BIRD_COUNT_THRESHOLD) badges.push("🌅");
  if (stats.postCount >= MASTER_POST_COUNT_THRESHOLD) badges.push("👑");
  return badges;
}

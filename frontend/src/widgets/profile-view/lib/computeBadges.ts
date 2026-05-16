import { BADGES } from "@entities/user";
import type { Badge } from "@entities/user";
import type { ProfileStats } from "./useProfileStats";

const SHORT_STREAK_THRESHOLD = 3;
const WEEK_STREAK_THRESHOLD = 7;
const EARLY_BIRD_COUNT_THRESHOLD = 10;
const MASTER_POST_COUNT_THRESHOLD = 100;

export function computeBadges(stats: ProfileStats): Badge[] {
  return [
    { ...BADGES[0], acquired: stats.maxStreak >= SHORT_STREAK_THRESHOLD },
    { ...BADGES[1], acquired: stats.maxStreak >= WEEK_STREAK_THRESHOLD },
    { ...BADGES[2], acquired: stats.earlyBirdCount >= EARLY_BIRD_COUNT_THRESHOLD },
    { ...BADGES[3], acquired: stats.postCount >= MASTER_POST_COUNT_THRESHOLD },
  ];
}

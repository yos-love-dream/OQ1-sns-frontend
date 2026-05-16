import {
  formatDateToStr,
  getDiffHours,
  getNow,
  parseDate,
  subtractDays,
} from "@shared/lib/utils";

const ONE_DAY_HOUR_MIN = 23;
const ONE_DAY_HOUR_MAX = 25;
const TWO_DAYS_HOUR_MIN = 47;
const TWO_DAYS_HOUR_MAX = 49;

const isSunday = (d: Date) => d.getDay() === 0;

function isAdjacentDate(newer: string, older: string) {
  const newerD = parseDate(newer);
  const olderD = parseDate(older);
  const diffHours = getDiffHours(newerD, olderD);
  if (diffHours >= ONE_DAY_HOUR_MIN && diffHours <= ONE_DAY_HOUR_MAX) return true;
  if (
    diffHours >= TWO_DAYS_HOUR_MIN &&
    diffHours <= TWO_DAYS_HOUR_MAX &&
    isSunday(subtractDays(newerD, 1))
  ) {
    return true;
  }
  return false;
}

function findMaxStreak(uniqueDates: string[]): number {
  let maxStreak = 1;
  let runningStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    if (isAdjacentDate(uniqueDates[i - 1], uniqueDates[i])) {
      runningStreak++;
      maxStreak = Math.max(maxStreak, runningStreak);
    } else {
      runningStreak = 1;
    }
  }
  return maxStreak;
}

function findCurrentStreak(uniqueDates: string[]): number {
  const dateSet = new Set(uniqueDates);
  let checkDate = getNow();

  if (!dateSet.has(formatDateToStr(checkDate))) {
    checkDate = subtractDays(checkDate, 1);
    if (isSunday(checkDate)) checkDate = subtractDays(checkDate, 1);
    if (!dateSet.has(formatDateToStr(checkDate))) return 0;
  }

  let streak = 0;
  while (true) {
    const dStr = formatDateToStr(checkDate);
    if (isSunday(checkDate)) {
      if (dateSet.has(dStr)) streak++;
      checkDate = subtractDays(checkDate, 1);
      continue;
    }
    if (dateSet.has(dStr)) {
      streak++;
      checkDate = subtractDays(checkDate, 1);
    } else {
      break;
    }
  }
  return streak;
}

export interface StreakResult {
  current: number;
  max: number;
}

export function calculateStreaks(dateList: string[]): StreakResult {
  if (dateList.length === 0) return { current: 0, max: 0 };
  const uniqueDates = Array.from(new Set(dateList)).sort((a, b) =>
    b.localeCompare(a),
  );
  const maxStreak = findMaxStreak(uniqueDates);
  const currentStreak = findCurrentStreak(uniqueDates);
  return {
    current: Math.max(1, currentStreak),
    max: Math.max(currentStreak, maxStreak),
  };
}

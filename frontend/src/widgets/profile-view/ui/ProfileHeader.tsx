"use client";

import { UserAvatar, UserBadges } from "@entities/user";
import { fadeRise } from "@shared/lib/animations";
import type { Badge } from "@shared/types";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProfileStats } from "../lib/useProfileStats";

interface ProfileLike {
  user_name: string;
  guk_no: number;
  avatar_url?: string | null;
  enneagram_type?: string | null;
}

interface ProfileHeaderProps {
  profile: ProfileLike;
  stats: ProfileStats;
  badges: Badge[];
  hasDoneToday: boolean;
  isOwnProfile: boolean;
  children?: ReactNode;
}

export function ProfileHeader({
  profile,
  stats,
  badges,
  hasDoneToday,
  isOwnProfile,
  children,
}: ProfileHeaderProps) {
  const acquiredBadges = badges.filter((b) => b.acquired);
  const preferredIcon = stats.preferredType === "Night" ? "🌛" : "☀️";

  return (
    <motion.div
      {...fadeRise(0)}
      className="bg-white p-6 md:rounded-lg md:border border-gray-200 mb-6 relative"
    >
      {children && (
        <div className="absolute top-4 right-4 hidden md:block z-20">
          {children}
        </div>
      )}

      <div className="flex items-center gap-6 md:gap-8">
        <div className="relative shrink-0">
          <UserAvatar
            src={profile.avatar_url ?? undefined}
            alt={profile.user_name}
            size="xl"
            hasDoneToday={hasDoneToday}
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow border border-gray-100">
            <span className="text-lg">{preferredIcon}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {profile.user_name}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-sm text-gray-500">
                  청년 {profile.guk_no}국
                </span>
                <UserBadges
                  enneagramType={profile.enneagram_type ?? undefined}
                  badges={acquiredBadges.map((b) => b.icon)}
                  showFullType
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6 mb-4">
            <ProfileStat label="연속일수" value={stats.streak} />
            <ProfileStat label="뱃지" value={acquiredBadges.length} />
            <ProfileStat label="게시물" value={stats.postCount} />
          </div>

          {isOwnProfile && (
            <Link
              href="/mypage/edit"
              className="block w-full text-center bg-gray-100 text-sm font-semibold py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              프로필 편집
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <span className="block font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

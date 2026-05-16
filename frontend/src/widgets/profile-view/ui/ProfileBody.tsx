"use client";

import { ActivityCalendar } from "@entities/activity";
import { useRecentReactions, useUserPosts } from "@entities/post";
import { useUserProfile } from "@entities/user";
import { FeedItem } from "@features/feed-item";
import { fadeRise, feedItemTransition } from "@shared/lib/animations";
import { isFeatureEnabled } from "@shared/lib/utils";
import { motion } from "framer-motion";
import { Calendar, MessageSquare } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { computeBadges } from "../lib/computeBadges";
import { useProfileStats } from "../lib/useProfileStats";
import { BadgeSection } from "./BadgeSection";
import { ProfileAmbientBackground } from "./ProfileAmbientBackground";
import { ProfileHeader } from "./ProfileHeader";
import { ReactionsCard } from "./ReactionsCard";

const PROFILE_FEED_BASE_DELAY = 0.5;

interface ProfileBodyProps {
  userId: string;
  isOwnProfile: boolean;
  initialProfile?: Parameters<typeof useUserProfile>[1];
  children?: ReactNode;
}

export function ProfileBody({
  userId,
  isOwnProfile,
  initialProfile,
  children,
}: ProfileBodyProps) {
  const { data: profile } = useUserProfile(userId, initialProfile);
  const { data: rawPosts } = useUserPosts(userId, isOwnProfile);

  const { activityDates, hasDoneToday, stats, posts } = useProfileStats(
    rawPosts,
    profile ?? undefined,
  );

  const postIds = useMemo(() => posts.map((p) => p.id), [posts]);
  const { data: reactions = [] } = useRecentReactions(
    userId,
    postIds,
    isOwnProfile && posts.length > 0,
  );

  if (!profile) {
    return (
      <div className="py-20 text-center text-gray-500">
        사용자를 찾을 수 없습니다.
      </div>
    );
  }

  const badges = computeBadges(stats);

  return (
    <div className="w-full">
      <ProfileAmbientBackground />

      <ProfileHeader
        profile={profile}
        stats={stats}
        badges={badges}
        hasDoneToday={hasDoneToday}
        isOwnProfile={isOwnProfile}
      >
        {children}
      </ProfileHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
        <div className="md:col-span-2 space-y-6">
          <BadgeSection badges={badges} />

          <motion.div
            {...fadeRise(0.25)}
            className="bg-white p-5 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-gray-900" size={18} />
              <h2 className="font-bold text-gray-900 text-sm">활동 기록</h2>
            </div>
            <ActivityCalendar
              completedDates={activityDates}
              streak={stats.streak}
            />
          </motion.div>

          <motion.div {...fadeRise(0.35)}>
            <h2 className="font-bold text-gray-900 text-sm mb-4 px-1">
              {isOwnProfile
                ? "내 큐티 묵상"
                : `${profile.user_name}님의 큐티 묵상`}
            </h2>
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    {...feedItemTransition(index, PROFILE_FEED_BASE_DELAY)}
                  >
                    <FeedItem
                      post={post}
                      currentUserId={isOwnProfile ? userId : null}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm bg-gray-50 rounded-lg">
                  작성한 묵상이 없습니다.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {isOwnProfile && (
            <>
              <ReactionsCard reactions={reactions} />
              {isFeatureEnabled("photoUpload") && <YouthProgressCard />}
            </>
          )}

          <GukNoCard gukNo={profile.guk_no} />
        </div>
      </div>
    </div>
  );
}

function YouthProgressCard() {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-gray-900" size={18} />
        <h2 className="font-bold text-gray-900 text-sm">청년부 현황</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">진행률</span>
          <span className="font-bold text-blue-500">82%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full"
            style={{ width: "82%" }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">42명 완료</p>
      </div>
    </div>
  );
}

function GukNoCard({ gukNo }: { gukNo: number }) {
  return (
    <motion.div
      {...fadeRise(0.3)}
      className="bg-white p-5 rounded-lg border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-gray-900" size={18} />
        <h2 className="font-bold text-gray-900 text-sm">소속 정보</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">소속</span>
          <span className="font-bold text-gray-900">청년 {gukNo}국</span>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { feedItemTransition } from "@shared/lib/animations";
import { formatDate, isSameDayCheck } from "@shared/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { FeedFilter, usePosts, type Post } from "@entities/post";
import { FeedItem } from "@features/feed-item";

const FEED_BASE_DELAY = 0.35;

interface HomeFeedProps {
  userId: string;
  enneagramType: string | null;
  filter: FeedFilter;
}

function filterByEnneagram(
  posts: Post[],
  filter: FeedFilter,
  enneagramType: string | null,
): Post[] {
  if (filter !== FeedFilter.MY_TYPE) return posts;
  if (!enneagramType) return posts;
  return posts.filter(
    (post) => post.user.enneagramType?.[0] === enneagramType[0],
  );
}

export function HomeFeed({ userId, enneagramType, filter }: HomeFeedProps) {
  const { data: posts } = usePosts(userId);

  const filteredPosts = useMemo(
    () => filterByEnneagram(posts, filter, enneagramType),
    [posts, filter, enneagramType],
  );

  if (filteredPosts.length === 0) {
    return (
      <motion.div
        {...feedItemTransition(0, FEED_BASE_DELAY)}
        className="py-10 text-center text-gray-400"
      >
        등록된 묵상이 없습니다.
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post, index) => {
        const prevPost = index > 0 ? filteredPosts[index - 1] : null;
        const showDateSeparator =
          prevPost && !isSameDayCheck(post.timestamp, prevPost.timestamp);

        return (
          <div key={post.id} className="flex flex-col">
            {showDateSeparator && (
              <motion.div
                {...feedItemTransition(0, FEED_BASE_DELAY)}
                className="flex items-center gap-4 py-6 px-4 md:px-0"
              >
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {formatDate(post.timestamp, "yyyy년 M월 d일")}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </motion.div>
            )}
            <motion.div {...feedItemTransition(index, FEED_BASE_DELAY)}>
              <FeedItem post={post} currentUserId={userId} />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

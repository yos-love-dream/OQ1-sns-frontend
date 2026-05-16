"use client";

import { DailyWordCard } from "@entities/daily-word";
import { FeedItem } from "@features/feed-item";
import { MOCK_POSTS } from "@entities/post";
import { TODAY_WORD } from "@entities/daily-word";
import { FeedFilter } from "@entities/post";
import { MobileHeader } from "@widgets/mobile-header";
import { useState } from "react";

export function DemoPage() {
  const [filter, setFilter] = useState<FeedFilter>(FeedFilter.ALL);

  const filteredPosts = MOCK_POSTS.filter((post) => {
    if (filter === FeedFilter.MY_TYPE) return post.user.type === "Morning";
    return true;
  });

  return (
    <div className="pb-20 md:py-8 px-0">
      <MobileHeader />

      <div className="md:px-4 mt-2 md:mt-0">
        <DailyWordCard demoData={TODAY_WORD} />

        <div className="px-4 md:px-0 flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          <FilterPill
            active={filter === FeedFilter.ALL}
            onClick={() => setFilter(FeedFilter.ALL)}
            label="전체 보기"
          />
          <FilterPill
            active={filter === FeedFilter.MY_TYPE}
            onClick={() => setFilter(FeedFilter.MY_TYPE)}
            label="☀️ 아침형"
          />
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <FeedItem key={post.id} post={post} currentUserId={null} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
        active
          ? "bg-black text-white border-black"
          : "bg-white text-gray-700 border-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

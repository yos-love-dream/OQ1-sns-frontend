"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { DailyWordCard } from "@entities/daily-word";
import { FeedFilter } from "@entities/post";
import { AsyncBoundary } from "@shared/ui/async-boundary";
import { MobileHeader } from "@widgets/mobile-header";
import { HomeFeed } from "./HomeFeed";
import { HomeFeedSkeleton } from "./HomeFeedSkeleton";

const fadeRise = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const particles = [
  {
    className: "absolute w-72 h-72 rounded-full bg-pink-200/20 blur-3xl",
    style: { top: "5%", left: "-15%" },
    animate: { y: [0, -24, 0], opacity: [0.25, 0.45, 0.25] },
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const },
  },
  {
    className: "absolute w-56 h-56 rounded-full bg-amber-200/20 blur-3xl",
    style: { top: "35%", right: "-12%" },
    animate: { y: [0, 18, 0], opacity: [0.2, 0.38, 0.2] },
    transition: {
      duration: 9,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 2.5,
    },
  },
  {
    className: "absolute w-40 h-40 rounded-full bg-blue-200/15 blur-2xl",
    style: { bottom: "25%", left: "15%" },
    animate: { y: [0, -12, 0], opacity: [0.15, 0.28, 0.15] },
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 1,
    },
  },
];

export default function HomeContent({
  userId,
  enneagramType,
}: {
  userId: string;
  enneagramType: string | null;
}) {
  const [filter, setFilter] = useState<FeedFilter>(FeedFilter.ALL);

  return (
    <div className="relative pb-20 md:py-8 px-0">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className={p.className}
            style={p.style}
            animate={p.animate}
            transition={p.transition}
          />
        ))}
      </div>

      <MobileHeader />

      <div className="md:px-4 mt-2 md:mt-0">
        <motion.div {...fadeRise(0)}>
          <DailyWordCard />
        </motion.div>

        <motion.div
          {...fadeRise(0.2)}
          className="px-4 md:px-0 flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2"
        >
          <button
            onClick={() => setFilter(FeedFilter.ALL)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${filter === FeedFilter.ALL ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300"}`}
          >
            전체 보기
          </button>
          <button
            onClick={() => setFilter(FeedFilter.MY_TYPE)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${filter === FeedFilter.MY_TYPE ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300"}`}
          >
            🧩 나와 같은 타입
          </button>
        </motion.div>

        <AsyncBoundary pendingFallback={<HomeFeedSkeleton />}>
          <HomeFeed
            userId={userId}
            enneagramType={enneagramType}
            filter={filter}
          />
        </AsyncBoundary>
      </div>
    </div>
  );
}

"use client";

import { fadeRise } from "@shared/lib/animations";
import { formatRelativeTime } from "@shared/lib/utils";
import { motion } from "framer-motion";

interface Reaction {
  id: string;
  type: "like" | "comment" | string;
  user_name: string;
  created_at: string;
}

interface ReactionsCardProps {
  reactions: Reaction[];
}

export function ReactionsCard({ reactions }: ReactionsCardProps) {
  return (
    <motion.div
      {...fadeRise(0.2)}
      className="bg-linear-to-br from-purple-600 via-pink-600 to-orange-500 p-6 rounded-lg shadow-md text-white relative overflow-hidden"
    >
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-1">공동체의 응원</h3>
        <p className="text-white/80 text-xs mb-4">
          지체들의 따뜻한 마음을 확인하세요.
        </p>

        {reactions.length > 0 ? (
          reactions.map((reaction) => (
            <ReactionRow key={reaction.id} reaction={reaction} />
          ))
        ) : (
          <ReactionEmpty />
        )}
      </div>
    </motion.div>
  );
}

function ReactionRow({ reaction }: { reaction: Reaction }) {
  const isLike = reaction.type === "like";
  const icon = isLike ? "🙏" : "💬";
  const text = isLike
    ? `${reaction.user_name}님이 '아멘'을 보냈어요.`
    : `${reaction.user_name}님이 댓글을 남겼어요.`;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 mb-2 last:mb-0 flex items-center gap-3 border border-white/10">
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm shrink-0">
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-xs font-semibold">{text}</p>
        <span className="text-[10px] opacity-70 mt-0.5 block">
          {formatRelativeTime(reaction.created_at)}
        </span>
      </div>
    </div>
  );
}

function ReactionEmpty() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col items-center justify-center text-center border border-white/10">
      <span className="text-2xl mb-2">🌱</span>
      <p className="text-sm font-semibold">아직 받은 반응이 없습니다.</p>
      <p className="text-[10px] text-white/80 mt-1">
        지체들과 말씀을 나누고 교제해 보세요!
      </p>
    </div>
  );
}

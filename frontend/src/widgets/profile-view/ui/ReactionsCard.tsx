"use client";

import { fadeRise } from "@shared/lib/animations";
import { formatRelativeTime } from "@shared/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface Reaction {
  id: string;
  type: "like" | "comment" | string;
  post_id: string;
  content: string | null;
  user_name: string;
  created_at: string;
}

interface ReactionsCardProps {
  reactions: Reaction[];
  postExcerpts: Record<string, string>;
}

export function ReactionsCard({ reactions, postExcerpts }: ReactionsCardProps) {
  return (
    <motion.div
      {...fadeRise(0.2)}
      className="bg-linear-to-br from-purple-600 via-pink-600 to-orange-500 p-5 rounded-lg shadow-md text-white relative overflow-hidden"
    >
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-1">공동체의 응원</h3>
        <p className="text-white/80 text-xs mb-4">
          지체들의 따뜻한 마음을 확인하세요.
        </p>

        {reactions.length > 0 ? (
          reactions.map((reaction) => (
            <ReactionRow
              key={reaction.id}
              reaction={reaction}
              excerpt={postExcerpts[reaction.post_id]}
            />
          ))
        ) : (
          <ReactionEmpty />
        )}
      </div>
    </motion.div>
  );
}

function ReactionRow({
  reaction,
  excerpt,
}: {
  reaction: Reaction;
  excerpt: string | undefined;
}) {
  const isLike = reaction.type === "like";
  const icon = isLike ? "🙏" : "💬";
  const hash = `#post-${reaction.post_id}${isLike ? "" : "-comments"}`;
  const postLabel = excerpt && excerpt.length > 0 ? excerpt : "내 묵상";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(`post-${reaction.post_id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", hash);
    if (!isLike) {
      window.dispatchEvent(
        new CustomEvent("oq:open-comments", {
          detail: { postId: reaction.post_id },
        }),
      );
    }
  };

  return (
    <Link
      href={hash}
      scroll={false}
      onClick={handleClick}
      className="block bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 mb-2 last:mb-0 border border-white/10 hover:bg-white/15 transition-colors leading-tight"
    >
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="text-xs shrink-0" aria-hidden>
          {icon}
        </span>
        <span className="text-xs font-semibold truncate min-w-0">
          {reaction.user_name}
        </span>
        <span className="text-[11px] text-white/70 shrink-0 ml-auto">
          {formatRelativeTime(reaction.created_at)}
        </span>
      </div>
      {!isLike && reaction.content && (
        <p className="text-xs text-white/90 mt-1 truncate">
          “{reaction.content}”
        </p>
      )}
      <p className="text-[11px] text-white/70 mt-0.5 truncate">
        {postLabel}
      </p>
    </Link>
  );
}

function ReactionEmpty() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col items-center justify-center text-center border border-white/10">
      <span className="text-2xl mb-2">🌱</span>
      <p className="text-sm font-semibold">아직 받은 반응이 없습니다.</p>
      <p className="text-xs text-white/80 mt-1">
        지체들과 말씀을 나누고 교제해 보세요!
      </p>
    </div>
  );
}

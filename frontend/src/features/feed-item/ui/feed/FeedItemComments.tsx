"use client";

import {
  createComment,
  fetchComments,
  type PostCommentRow,
} from "@entities/post";
import { formatRelativeTime, sanitizeText } from "@shared/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAlert } from "@shared/lib/alert";
import { UserAvatar } from "@entities/user";

interface FeedItemCommentsProps {
  postId: string;
  currentUserId: string | null;
  onCommentCountChange: (delta: number) => void;
}

const MAX_COMMENT_LENGTH = 1000;

export default function FeedItemComments({
  postId,
  currentUserId,
  onCommentCountChange,
}: FeedItemCommentsProps) {
  const [comments, setComments] = useState<PostCommentRow[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const showAlert = useAlert();

  // 최초 마운트 시 댓글 로드
  useEffect(() => {
    const load = async () => {
      try {
        const rows = await fetchComments(postId);
        setComments(rows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUserId) return;

    const cleanComment = sanitizeText(commentText);

    if (cleanComment.length > MAX_COMMENT_LENGTH) {
      showAlert("댓글은 1,000자 이내로 작성해 주세요.");
      return;
    }

    if (!cleanComment) return;

    try {
      const created = await createComment(postId, currentUserId, cleanComment);
      setComments((prev) => [...prev, created]);
      onCommentCountChange(1);
      setCommentText("");
    } catch (error) {
      console.error(error);
      showAlert("댓글 작성 실패");
    }
  };

  return (
    <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="max-h-48 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-2">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 items-start py-2.5">
              <Link href={`/profile/${comment.user_id}`}>
                <UserAvatar
                  src={comment.user?.avatar_url ?? undefined}
                  alt={comment.user?.user_name}
                  size="sm"
                  hasDoneToday={comment.user?.hasDoneToday}
                />
              </Link>
              <div className="flex-1 flex flex-col gap-1">
                <div className="text-[13px] leading-snug">
                  <Link
                    href={`/profile/${comment.user_id}`}
                    className="font-bold mr-2 text-gray-900 cursor-pointer hover:text-gray-600 transition-colors"
                  >
                    {comment.user?.user_name || "알 수 없음"}
                  </Link>
                  <span className="text-gray-800 wrap-break-word">
                    {comment.content}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 font-medium tracking-tight">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[11px] text-gray-400 py-2 font-medium">
            첫 댓글을 남겨보세요.
          </p>
        )}
      </div>

      {currentUserId && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 pt-2 border-t border-gray-50"
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글 달기..."
            maxLength={MAX_COMMENT_LENGTH}
            className="flex-1 text-[13px] bg-transparent border-none p-0 focus:ring-0 placeholder:text-gray-400 outline-hidden"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="text-[13px] text-blue-500 font-bold disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            게시
          </button>
        </form>
      )}
    </div>
  );
}

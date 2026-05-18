import { z } from "zod";

// Row 타입은 schemas의 단일 source of truth — model/types.ts 등 다른 곳에서 별도 interface로 중복 정의 금지.

const UserSummarySchema = z.object({
  user_name: z.string(),
  avatar_url: z.string().nullable().optional(),
});

const LikeSchema = z.object({
  user_id: z.string(),
  user: UserSummarySchema.nullable().optional(),
});

const CommentCountSchema = z.object({ count: z.number() });

const LikedByMeSchema = z.object({ user_id: z.string() });

const DailyQtJoinSchema = z.object({
  bible_book: z.string(),
  chapter: z.number(),
  verse_from: z.number(),
  verse_to: z.number(),
  content: z.string().nullable().optional(),
});

const UserPostDailyQtJoinSchema = DailyQtJoinSchema.extend({
  qt_date: z.string(),
});

const QtAnswerUserSchema = z.object({
  id: z.string(),
  user_name: z.string(),
  guk_no: z.number(),
  avatar_url: z.string().nullable().optional(),
  enneagram_type: z.string().nullable().optional(),
});

export const QtAnswerRowSchema = z.object({
  id: z.string(),
  meditation: z.string(),
  created_at: z.string(),
  is_public: z.boolean(),
  user_id: z.string(),
  user: QtAnswerUserSchema.nullable(),
  daily_qt: DailyQtJoinSchema,
  likes: z.array(LikeSchema),
  comments: z.array(CommentCountSchema),
  liked_by_me: z.array(LikedByMeSchema),
});

export const UserPostRowSchema = z.object({
  id: z.string(),
  user_id: z.string().optional(),
  created_at: z.string(),
  meditation: z.string(),
  is_public: z.boolean(),
  oq_daily_qt: UserPostDailyQtJoinSchema,
  likes: z.array(LikeSchema),
  comments: z.array(CommentCountSchema),
  liked_by_me: z.array(LikedByMeSchema),
});

export const DBReactionRowSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  user: z
    .object({ user_name: z.string(), avatar_url: z.string().nullable().optional() })
    .nullable(),
});

// oq_qt_likes는 (user_id, answer_id) 합성 PK라 id 컬럼이 없음
export const DBLikeRowSchema = z.object({
  user_id: z.string(),
  answer_id: z.string(),
  created_at: z.string(),
  user: z
    .object({ user_name: z.string(), avatar_url: z.string().nullable().optional() })
    .nullable(),
});

export const PostCommentRowSchema = z.object({
  id: z.string(),
  content: z.string(),
  created_at: z.string(),
  user_id: z.string(),
  user: z
    .object({
      user_name: z.string(),
      avatar_url: z.string().nullable(),
      hasDoneToday: z.boolean().optional(),
    })
    .nullable(),
});

export const UserActivityRowSchema = z.object({
  user_id: z.string(),
  created_at: z.string(),
});

export const UserIdRowSchema = z.object({ user_id: z.string() });

export type QtAnswerRow = z.infer<typeof QtAnswerRowSchema>;
export type UserPostRow = z.infer<typeof UserPostRowSchema>;
export type DBReactionRow = z.infer<typeof DBReactionRowSchema>;
export type DBLikeRow = z.infer<typeof DBLikeRowSchema>;

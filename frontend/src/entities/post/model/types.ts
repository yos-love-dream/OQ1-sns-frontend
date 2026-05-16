import type { User } from "@entities/user";

export interface Post {
  id: string;
  user: User;
  content: string;
  scriptureRef: string;
  scriptureContent?: string;
  scriptureTitle?: string;
  imageUrl?: string;
  isAnonymous?: boolean;
  amenCount: number;
  commentCount: number;
  isLiked: boolean;
  timestamp: string;
  tags: string[];
  likedUsers?: { userId: string; userName: string; avatarUrl?: string }[];
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export enum FeedFilter {
  ALL = "ALL",
  MY_TYPE = "MY_TYPE",
}

export interface QtAnswerRow {
  id: string;
  meditation: string;
  created_at: string;
  is_public: boolean;
  user_id: string;
  user: {
    id: string;
    user_name: string;
    guk_no: number;
    avatar_url?: string;
    enneagram_type?: string;
  } | null;
  daily_qt: {
    bible_book: string;
    chapter: number;
    verse_from: number;
    verse_to: number;
    content: string;
  };
  likes: {
    user_id: string;
    user: { user_name: string; avatar_url?: string };
  }[];
  comments: { count: number }[];
  liked_by_me: { user_id: string }[];
}

export interface UserPostRow {
  id: string;
  user_id?: string;
  created_at: string;
  meditation: string;
  is_public: boolean;
  oq_daily_qt: {
    qt_date: string;
    bible_book: string;
    chapter: number;
    verse_from: number;
    verse_to: number;
    content: string;
  };
  likes: {
    user_id: string;
    user: { user_name: string; avatar_url?: string };
  }[];
  comments: { count: number }[];
  liked_by_me: { user_id: string }[];
}

export interface DBReactionRow {
  id: string;
  created_at: string;
  user: {
    user_name: string;
    avatar_url?: string;
  } | null;
}

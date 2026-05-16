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

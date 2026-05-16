import { createClient } from "@shared/api/supabase/client";

export interface PostCommentRow {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    user_name: string;
    avatar_url: string | null;
    hasDoneToday?: boolean;
  } | null;
}

const COMMENT_COLUMNS = `
  id, content, created_at, user_id,
  user:oq_users!user_id (user_name, avatar_url)
`;

export async function fetchComments(postId: string): Promise<PostCommentRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("oq_qt_comments")
    .select(COMMENT_COLUMNS)
    .eq("answer_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as unknown as PostCommentRow[]) ?? [];
}

export async function createComment(
  postId: string,
  userId: string,
  content: string,
): Promise<PostCommentRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("oq_qt_comments")
    .insert({ answer_id: postId, user_id: userId, content })
    .select(COMMENT_COLUMNS)
    .single();
  if (error || !data) throw error ?? new Error("Failed to create comment");
  return data as unknown as PostCommentRow;
}

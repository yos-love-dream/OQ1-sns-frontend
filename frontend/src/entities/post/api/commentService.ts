import { createClient } from "@shared/api/supabase/client";
import { unwrap } from "@shared/api/supabase/unwrap";
import { z } from "zod";
import { PostCommentRowSchema } from "./schemas";

export type PostCommentRow = z.infer<typeof PostCommentRowSchema>;

const COMMENT_COLUMNS = `
  id, content, created_at, user_id,
  user:oq_users!user_id (user_name, avatar_url)
`;

export async function fetchComments(postId: string): Promise<PostCommentRow[]> {
  const supabase = createClient();
  return unwrap(
    supabase
      .from("oq_qt_comments")
      .select(COMMENT_COLUMNS)
      .eq("answer_id", postId)
      .order("created_at", { ascending: true }),
    z.array(PostCommentRowSchema),
  );
}

export async function createComment(
  postId: string,
  userId: string,
  content: string,
): Promise<PostCommentRow> {
  const supabase = createClient();
  return unwrap(
    supabase
      .from("oq_qt_comments")
      .insert({ answer_id: postId, user_id: userId, content })
      .select(COMMENT_COLUMNS)
      .single(),
    PostCommentRowSchema,
  );
}

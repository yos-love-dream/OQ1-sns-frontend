import { createClient } from "@shared/api/supabase/client";
import { unwrapOrNull } from "@shared/api/supabase/unwrap";
import type { DailyQt } from "@entities/daily-word";
import { EditingPostRowSchema } from "./schemas";

export interface EditingPost {
  meditation: string;
  is_public: boolean;
}

export interface EditingPostBundle {
  editingPost: EditingPost;
  dailyQt: DailyQt;
}

export async function fetchEditingPost(
  editPostId: string,
): Promise<EditingPostBundle | null> {
  const supabase = createClient();
  const data = await unwrapOrNull(
    supabase
      .from("oq_user_qt_answers")
      .select("*, daily_qt:daily_qt_id(*)")
      .eq("id", editPostId)
      .single(),
    EditingPostRowSchema,
  );
  if (!data) return null;
  return {
    editingPost: {
      meditation: data.meditation,
      is_public: data.is_public,
    },
    dailyQt: { ...data.daily_qt, content: data.daily_qt.content ?? undefined },
  };
}

import { createClient } from "@shared/api/supabase/client";
import type { DailyQt } from "@entities/daily-word";

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
  const { data } = await supabase
    .from("oq_user_qt_answers")
    .select("*, daily_qt:daily_qt_id(*)")
    .eq("id", editPostId)
    .single();
  if (!data) return null;
  return {
    editingPost: {
      meditation: data.meditation as string,
      is_public: data.is_public as boolean,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- supabase join shape
    dailyQt: data.daily_qt as any as DailyQt,
  };
}

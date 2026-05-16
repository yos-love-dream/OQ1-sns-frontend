import { createClient } from "@shared/api/supabase/client";
import { formatLineBreaks, getNow } from "@shared/lib/utils";
import { format } from "date-fns";

export async function fetchTodayQt() {
  const supabase = createClient();
  const todayStr = format(getNow(), "yyyy-MM-dd");

  const { data: todayQt } = await supabase
    .from("oq_daily_qt")
    .select("*")
    .eq("qt_date", todayStr)
    .single();

  const qtData =
    todayQt ??
    (
      await supabase
        .from("oq_daily_qt")
        .select("*")
        .order("qt_date", { ascending: false })
        .limit(1)
        .single()
    ).data;

  return qtData
    ? { ...qtData, content: formatLineBreaks(qtData.content) }
    : null;
}

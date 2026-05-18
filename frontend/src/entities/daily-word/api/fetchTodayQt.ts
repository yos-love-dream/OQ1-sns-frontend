import { createClient } from "@shared/api/supabase/client";
import { unwrapOrNull } from "@shared/api/supabase/unwrap";
import { formatLineBreaks, getNow } from "@shared/lib/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import type { DailyQt } from "../model/types";
import { DailyQtSchema } from "./schemas";

export async function fetchTodayQt(
  client?: SupabaseClient,
): Promise<DailyQt | null> {
  const supabase = client ?? createClient();
  const todayStr = format(getNow(), "yyyy-MM-dd");

  const todayQt = await unwrapOrNull(
    supabase
      .from("oq_daily_qt")
      .select("*")
      .eq("qt_date", todayStr)
      .single(),
    DailyQtSchema,
  );

  const qtData =
    todayQt ??
    (await unwrapOrNull(
      supabase
        .from("oq_daily_qt")
        .select("*")
        .order("qt_date", { ascending: false })
        .limit(1)
        .single(),
      DailyQtSchema,
    ));

  return qtData
    ? { ...qtData, content: formatLineBreaks(qtData.content) }
    : null;
}

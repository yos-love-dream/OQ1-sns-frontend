"use client";

import { createClient } from "@shared/api/supabase/client";
import { getNow } from "@shared/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import type { DailyQt } from "../model/types";

interface EditingPost {
  meditation: string;
  is_public: boolean;
}

interface UseDailyQtResult {
  dailyQt: DailyQt | null;
  editingPost: EditingPost | null;
  isLoading: boolean;
}

async function fetchEditingPost(editPostId: string) {
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

async function fetchTodayOrLatestQt(): Promise<DailyQt | null> {
  const supabase = createClient();
  const todayStr = format(getNow(), "yyyy-MM-dd");

  const { data: todayQt } = await supabase
    .from("oq_daily_qt")
    .select("*")
    .eq("qt_date", todayStr)
    .single();
  if (todayQt) return todayQt as DailyQt;

  const { data: latestQt } = await supabase
    .from("oq_daily_qt")
    .select("*")
    .order("qt_date", { ascending: false })
    .limit(1)
    .single();
  return (latestQt as DailyQt) ?? null;
}

export function useDailyQt(editPostId: string | null): UseDailyQtResult {
  const [dailyQt, setDailyQt] = useState<DailyQt | null>(null);
  const [editingPost, setEditingPost] = useState<EditingPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (editPostId) {
        const result = await fetchEditingPost(editPostId);
        if (cancelled) return;
        if (result) {
          setEditingPost(result.editingPost);
          setDailyQt(result.dailyQt);
        }
      } else {
        const qt = await fetchTodayOrLatestQt();
        if (cancelled) return;
        setDailyQt(qt);
      }
      if (!cancelled) setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [editPostId]);

  return { dailyQt, editingPost, isLoading };
}

"use client";

import { fetchTodayQt, type DailyQt } from "@entities/daily-word";
import { useEffect, useState } from "react";
import { fetchEditingPost, type EditingPost } from "../api/fetchEditingPost";

interface UseDailyQtResult {
  dailyQt: DailyQt | null;
  editingPost: EditingPost | null;
  isLoading: boolean;
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
        const qt = await fetchTodayQt();
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

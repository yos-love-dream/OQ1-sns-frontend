"use client";

import { getCurrentUser } from "@shared/api/supabase/auth-client";
import { useCallback, useEffect, useState } from "react";
import { fetchProfileRow, type ProfileRow } from "../api/userService";

export type ProfileData = ProfileRow;

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return null;
      }
      const fallbackAvatar =
        (user.user_metadata?.avatar_url as string | undefined) ?? null;
      const row = await fetchProfileRow(user.id, fallbackAvatar);
      setProfile(row);
      setLoading(false);
      return row;
    } catch (e) {
      setError(e instanceof Error ? e.message : "프로필 로드 실패");
      setProfile(null);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
}

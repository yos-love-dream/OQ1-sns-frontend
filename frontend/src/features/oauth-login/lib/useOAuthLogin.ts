"use client";

import { useAlert } from "@app/providers/AlertProvider";
import { signInWithOAuth } from "@shared/api/supabase/auth-client";
import { useCallback } from "react";

type OAuthProvider = "kakao" | "apple";

export function useOAuthLogin() {
  const showAlert = useAlert();

  const login = useCallback(
    async (provider: OAuthProvider, params?: Record<string, string>) => {
      try {
        if (params) {
          for (const [key, value] of Object.entries(params)) {
            localStorage.setItem(`oauth:${key}`, value);
          }
        }

        const data = await signInWithOAuth(
          provider,
          `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        );
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch (e) {
        console.error(`${provider} login error:`, e);
        showAlert("Supabase 설정을 확인해 주세요. (.env.local)");
      }
    },
    [showAlert],
  );

  return { login };
}

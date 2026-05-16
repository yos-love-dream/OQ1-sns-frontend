"use client";

import { useAlert } from "@app/providers/AlertProvider";
import { updateProfile } from "@entities/user";
import type { SignupFormData } from "./schema";
import { getCurrentUser } from "@shared/api/supabase/auth-client";
import { useRouter } from "next/navigation";

export function useSignupSubmit(fromKakao: boolean) {
  const router = useRouter();
  const showAlert = useAlert();

  const submitSignup = async (data: SignupFormData) => {
    if (!fromKakao) {
      router.push("/login");
      return;
    }

    const user = await getCurrentUser();
    if (!user) {
      showAlert(
        "로그인 세션이 없습니다. 카카오로 다시 로그인해 주세요.",
        () => router.push("/login"),
      );
      return;
    }

    try {
      await updateProfile(user.id, {
        user_name: data.user_name,
        guk_no: data.guk_no,
        birth_date: data.birth_date,
        enneagram_type: data.enneagram_type,
      });
    } catch (error) {
      console.error("oq_users update error:", error);
      showAlert("회원 정보 저장에 실패했습니다.");
      return;
    }

    localStorage.removeItem("oauth:enneagram-type");
    router.push("/");
    router.refresh();
  };

  return submitSignup;
}

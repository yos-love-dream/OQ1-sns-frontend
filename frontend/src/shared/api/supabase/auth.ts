import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";
import { createClient } from "./server";
import { unwrapOrNull } from "./unwrap";

const OqUserRowSchema = z.object({
  id: z.string(),
  user_name: z.string(),
  guk_no: z.number(),
  birth_date: z.string().nullable(),
  enneagram_type: z.string().nullable(),
  avatar_url: z.string().nullable(),
  deleted_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * 서버 컴포넌트에서 현재 유저를 가져옵니다.
 * React.cache()로 동일 요청 내 중복 호출을 제거합니다.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * 서버 컴포넌트에서 현재 유저의 oq_users 프로필을 가져옵니다.
 * React.cache()로 동일 요청 내 중복 호출을 제거합니다.
 */
export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const data = await unwrapOrNull(
    supabase.from("oq_users").select("*").eq("id", userId).single(),
    OqUserRowSchema,
  );
  if (!data) return null;
  return { ...data, avatar_url: data.avatar_url || "" };
});

function isProfileComplete(
  profile: Awaited<ReturnType<typeof getProfile>>,
): boolean {
  return !!profile?.birth_date;
}

/**
 * 인증 + 가입 완료 필수.
 * 미인증 → /login, 미가입 → /signup
 * 대부분의 보호 페이지에서 사용.
 */
export async function requireAuth() {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/signup?from=kakao");

  return { profile: profile! };
}

/**
 * 인증만 필수, 미가입 허용.
 * 미인증 → /login
 * signup 페이지에서 사용.
 */
export async function requireAuthOnly() {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.id);
  if (isProfileComplete(profile)) redirect("/");

  return { user };
}

/**
 * 이미 인증된 사용자를 리다이렉트.
 * 인증 + 가입 완료 → /, 인증 + 미가입 → /signup
 * login 페이지에서 사용.
 */
export async function redirectIfAuthenticated() {
  const user = await getUser();
  if (!user) return;

  const profile = await getProfile(user.id);
  if (isProfileComplete(profile)) {
    redirect("/");
  } else {
    redirect("/signup?from=kakao");
  }
}

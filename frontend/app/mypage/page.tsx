import { requireAuth } from "@shared/api/supabase/auth";
import type { Metadata } from "next";
import { MyPageContent } from "@views/mypage";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function MyPage() {
  const { profile } = await requireAuth();
  return <MyPageContent userId={profile!.id} initialProfile={profile} />;
}

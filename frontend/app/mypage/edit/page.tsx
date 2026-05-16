import { requireAuth } from "@shared/api/supabase/auth";
import { MyPageEditPage } from "@views/mypage-edit";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EditPage() {
  const { profile } = await requireAuth();
  return <MyPageEditPage userId={profile!.id} />;
}

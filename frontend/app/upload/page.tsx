import { requireAuth } from "@shared/api/supabase/auth";
import type { Metadata } from "next";
import { UploadContent } from "@features/upload-post";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function UploadPage() {
  const { profile } = await requireAuth();

  return (
    <UploadContent
      userName={profile?.user_name || "나"}
      avatarUrl={profile?.avatar_url || null}
    />
  );
}

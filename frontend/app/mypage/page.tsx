import { requireAuth } from "@shared/api/supabase/auth";
import { createClient as createServerSupabase } from "@shared/api/supabase/server";
import { fetchUserPosts } from "@entities/post";
import { getQueryClient } from "@shared/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { MyPageContent } from "@pages/mypage";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function MyPage() {
  const { profile } = await requireAuth();
  const userId = profile!.id;

  const queryClient = getQueryClient();
  const supabase = await createServerSupabase();
  await queryClient.prefetchQuery({
    queryKey: ["userPosts", userId, true],
    queryFn: () => fetchUserPosts(userId, true, supabase),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPageContent userId={userId} initialProfile={profile} />
    </HydrationBoundary>
  );
}

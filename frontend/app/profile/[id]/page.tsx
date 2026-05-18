import { ProfileDetailPage } from "@pages/profile-detail";
import { fetchUserPosts } from "@entities/post";
import { getQueryClient } from "@shared/lib/getQueryClient";
import { getUser } from "@shared/api/supabase/auth";
import { createClient as createServerSupabase } from "@shared/api/supabase/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getUser();
  const currentUserId = currentUser?.id ?? null;

  if (currentUserId === id) {
    redirect("/mypage");
  }

  const queryClient = getQueryClient();
  const supabase = await createServerSupabase();
  await queryClient.prefetchQuery({
    queryKey: ["userPosts", id, false],
    queryFn: () => fetchUserPosts(id, false, supabase),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileDetailPage targetUserId={id} currentUserId={currentUserId} />
    </HydrationBoundary>
  );
}

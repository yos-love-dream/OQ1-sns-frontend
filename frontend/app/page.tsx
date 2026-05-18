import { fetchTodayQt } from "@entities/daily-word";
import { fetchPosts } from "@entities/post";
import { HomeContent } from "@pages/home";
import { requireAuth } from "@shared/api/supabase/auth";
import { createClient as createServerSupabase } from "@shared/api/supabase/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function HomePage() {
  const { profile } = await requireAuth();

  const queryClient = new QueryClient();
  const supabase = await createServerSupabase();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["posts", profile.id],
      queryFn: () => fetchPosts(profile.id, supabase),
    }),
    queryClient.prefetchQuery({
      queryKey: ["todayQt"],
      queryFn: () => fetchTodayQt(supabase),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent
        userId={profile.id}
        enneagramType={profile.enneagram_type ?? null}
      />
    </HydrationBoundary>
  );
}

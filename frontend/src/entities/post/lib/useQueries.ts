"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchPosts,
  fetchRecentReactions,
  fetchUserPosts,
} from "../api/postService";

export function usePosts(currentUserId: string | null) {
  return useSuspenseQuery({
    queryKey: ["posts", currentUserId],
    queryFn: () => fetchPosts(currentUserId),
  });
}

export function useUserPosts(userId: string, isOwnProfile: boolean) {
  return useSuspenseQuery({
    queryKey: ["userPosts", userId, isOwnProfile],
    queryFn: () => fetchUserPosts(userId, isOwnProfile),
  });
}

export function useRecentReactions(
  userId: string,
  postIds: string[],
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["reactions", userId],
    queryFn: () => fetchRecentReactions(userId, postIds),
    enabled: enabled && postIds.length > 0,
  });
}

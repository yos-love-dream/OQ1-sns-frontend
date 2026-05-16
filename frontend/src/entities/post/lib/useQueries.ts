"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchPosts,
  fetchRecentReactions,
  fetchUserPosts,
} from "../api/postService";

export function usePosts(currentUserId: string | null) {
  return useQuery({
    queryKey: ["posts", currentUserId],
    queryFn: () => fetchPosts(currentUserId),
    enabled: currentUserId !== undefined,
  });
}

export function useUserPosts(userId: string, isOwnProfile: boolean) {
  return useQuery({
    queryKey: ["userPosts", userId, isOwnProfile],
    queryFn: () => fetchUserPosts(userId, isOwnProfile),
    enabled: !!userId,
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
